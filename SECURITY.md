# Security Documentation

## Overview

This document explains how API keys are managed in the Networking Follow-Up Tool and outlines the security considerations for deployment.

## The Challenge: Client-Side Architecture

This application is a **100% client-side, single-page application** designed to be embedded in Webflow custom code. This architecture presents a fundamental security limitation:

⚠️ **API keys are visible in the browser's source code by design.**

This is an inherent limitation of client-side applications - there is no way to completely hide API keys when the browser needs to use them directly.

## Our Security Approach

We implement a **layered security strategy** that balances usability with protection:

### 1. Keep Keys Out of Git ✅

**Problem**: Committing API keys to Git exposes them permanently in history.

**Solution**: We use a build process that separates source code from production deployment:

```
Source (Git)                    Production (Webflow)
├── index.html                  ├── index-production.html
│   (with placeholders)    →    │   (with real keys)
├── .env                        │
│   (real keys, gitignored)     └── (deployed to Webflow)
└── build.js
    (injection script)
```

**Files in Git:**
- ✅ `index.html` - Contains placeholders only
- ✅ `build.js` - Build script (safe to commit)
- ✅ `.env.example` - Template without real keys
- ❌ `.env` - Real keys (gitignored)
- ❌ `index-production.html` - Built file with keys (gitignored)

### 2. Build Process

The `npm run build` command:

1. Reads real API keys from `.env` file
2. Injects them into `index.html` placeholders
3. Generates `index-production.html` with keys
4. Validates all required keys are present
5. Warns if placeholder values detected

**What you commit:** Source code with placeholders
**What you deploy:** Production HTML with real keys

### 3. Access Controls

#### Git Repository
- `.gitignore` prevents committing sensitive files
- GitHub Actions/workflows cannot access `.env` (not in repo)
- Collaborators get source code only, not keys

#### Local Development
- `.env` stored locally only
- Not synced to cloud (unless you explicitly do so)
- Each developer uses their own API keys

#### Webflow Deployment
- Production HTML pasted directly into Webflow
- Only authorized Webflow users can view source
- Not exposed via Git

## Security Limitations & Risks

### ⚠️ Known Limitations

1. **Browser Visibility**
   - Anyone using the app can view source in browser DevTools
   - API keys are visible in the JavaScript `CONFIG` object
   - This is **unavoidable** with client-side architecture

2. **API Key Exposure Scenarios**
   - User opens browser DevTools → Can see keys
   - User views page source → Can see keys
   - Browser extensions → May capture keys
   - Browser cache → May store keys

3. **Potential Abuse**
   - Someone could extract your Claude API key
   - They could use it for their own Claude API calls
   - This would bill your account
   - Rate limiting won't prevent determined abuse

### Risk Mitigation Strategies

#### 1. API Usage Monitoring

**Claude API (Anthropic):**
```bash
# Set up billing alerts
1. Go to console.anthropic.com
2. Navigate to Billing → Usage
3. Set up email alerts for usage thresholds
4. Monitor daily/weekly
```

**Webflow API:**
```bash
# Check API logs regularly
1. Webflow Dashboard → Integrations
2. Review API usage and activity
3. Rotate tokens if suspicious activity detected
```

#### 2. Rate Limiting

**Recommended limits for Claude API:**
- Set monthly budget cap: $50-100
- Enable email notifications at 50%, 75%, 90%
- Use Anthropic's rate limit settings

**For production systems:**
Consider implementing a backend proxy with rate limiting.

#### 3. Key Rotation Schedule

Rotate API keys regularly to minimize exposure window:

- **Monthly**: Review API usage
- **Quarterly**: Rotate all API keys
- **Immediately**: If suspicious activity detected
- **Immediately**: If key accidentally exposed

**Rotation Process:**
```bash
1. Generate new API keys
2. Update .env file
3. Run npm run build
4. Deploy new index-production.html to Webflow
5. Revoke old API keys
```

#### 4. Access Control

**Webflow Account:**
- Use strong password + 2FA
- Limit who has Webflow Designer access
- Review team member permissions regularly

**API Accounts:**
- Separate API keys for dev/production
- Use different Anthropic accounts if possible
- Don't share keys via email/Slack

## Better Security: Future Improvements

For production-grade security, consider these architectural improvements:

### Option A: Backend Proxy (Recommended)

Add a simple backend that holds the API keys:

```
Browser → Your Backend → Claude API
         (keys here)     (keys hidden)
```

**Benefits:**
- API keys completely hidden from browser
- Can implement rate limiting
- Can add authentication
- Can log all requests
- Can block suspicious usage

**Drawbacks:**
- Requires hosting (Vercel, Netlify, AWS Lambda)
- Additional complexity
- Ongoing hosting costs ($5-20/month)

**Example Stack:**
- Vercel Serverless Functions
- Environment variables in Vercel dashboard
- Frontend calls `/api/extract-card` instead of Claude directly

### Option B: API Key Restrictions

Some APIs allow restricting keys by domain/IP:

**Webflow API:**
- No domain restrictions available
- Use token with minimum required permissions
- Revoke and regenerate regularly

**Claude API:**
- Check if Anthropic adds domain restrictions
- Use separate keys for different apps
- Monitor usage closely

### Option C: Netlify/Vercel Functions

Deploy as static site with serverless functions:

```
index.html → Hosted on Netlify
.env → Stored in Netlify env vars
Functions → Backend proxy for API calls
```

**Benefits:**
- Free tier available
- Automatic HTTPS
- Easy deploys via Git
- Environment variables secure

## Security Best Practices

### DO ✅

- ✅ Store real keys in `.env` only
- ✅ Keep `.env` out of Git (already configured)
- ✅ Use `npm run build` for production deployments
- ✅ Monitor API usage regularly
- ✅ Set up billing alerts
- ✅ Rotate keys quarterly
- ✅ Use strong passwords on all accounts
- ✅ Enable 2FA on Anthropic and Webflow
- ✅ Review access logs periodically
- ✅ Deploy from secure computer only

### DON'T ❌

- ❌ Commit `.env` to Git
- ❌ Commit `index-production.html` to Git
- ❌ Share API keys via email/chat
- ❌ Use production keys for testing
- ❌ Leave old keys active after rotation
- ❌ Share your `.env` file
- ❌ Deploy from public/shared computers
- ❌ Push to public GitHub repo without checking
- ❌ Ignore usage spikes
- ❌ Share Webflow account credentials

## Incident Response Plan

### If API Key is Exposed

1. **Immediately revoke the exposed key**
   - Anthropic Console → API Keys → Revoke
   - Webflow → Integrations → Revoke token

2. **Generate new keys**
   - Create replacement keys
   - Update `.env` file
   - Run `npm run build`
   - Deploy to Webflow

3. **Review usage logs**
   - Check for unauthorized API calls
   - Estimate potential costs
   - Document the incident

4. **Notify stakeholders**
   - Inform team of the exposure
   - Update security procedures
   - Review how exposure occurred

5. **Prevent recurrence**
   - Update `.gitignore` if needed
   - Add pre-commit hooks
   - Train team on security practices

### If Unusual API Usage Detected

1. **Check Anthropic usage dashboard**
   - Look for spike in requests
   - Check request patterns
   - Review timestamps

2. **Check Webflow API logs**
   - Review recent CMS operations
   - Check for unusual data access

3. **If abuse confirmed:**
   - Rotate all API keys immediately
   - Review access logs
   - Consider implementing backend proxy

## Cost Management

### Expected Costs (Normal Usage)

**Claude API:**
- Per contact: $0.01-0.02
- 100 contacts/month: ~$1-2
- 500 contacts/month: ~$5-10

**Webflow:**
- Included in paid plans
- No per-request costs

### Budget Recommendations

**Conservative:**
- Claude monthly budget: $25
- Alert threshold: $20

**Moderate:**
- Claude monthly budget: $100
- Alert threshold: $75

**High Volume:**
- Claude monthly budget: $250
- Alert threshold: $200
- Consider backend proxy for cost control

## Questions & Answers

**Q: Can someone steal my API key?**
A: Yes, if they view the page source or use DevTools. This is unavoidable for client-side apps.

**Q: What's the worst that could happen?**
A: Someone uses your Claude API key → You get billed for their usage.

**Q: Why not use a backend?**
A: Simplicity for MVP. A backend adds complexity, hosting costs, and maintenance. This approach is acceptable for low-traffic internal tools.

**Q: Is this secure enough for production?**
A: For internal tools with trusted users: Yes
For public-facing applications: Consider adding a backend proxy

**Q: How do I know if my key is being abused?**
A: Monitor Anthropic usage dashboard. Look for:
- Unusual request volume
- Requests at odd hours
- Rapid spikes in usage

**Q: Should I use different keys for dev and production?**
A: Yes, if possible. Create separate Anthropic accounts or projects.

## Compliance Considerations

### Data Privacy

**What data is collected:**
- Business card images (temporarily)
- Contact information (names, emails, companies)
- Voice recordings (temporarily)
- Conversation notes

**Where data is stored:**
- Webflow CMS (permanent)
- Claude API (processed, not stored)
- User's browser (temporarily)

**Compliance:**
- Inform users about data collection
- Get consent before capturing cards
- Provide data deletion mechanism
- Follow GDPR/CCPA if applicable

### GDPR Compliance

If processing EU data:
- [ ] Add privacy policy
- [ ] Get explicit consent
- [ ] Provide data export
- [ ] Provide data deletion
- [ ] Document data flows
- [ ] Sign DPAs with vendors

## Support & Updates

**Security Issues:** Report to russell@hitelabs.com

**This document updated:** 2025-10-02

**Review schedule:** Quarterly or after any security incident

---

## Summary

✅ **What's Protected:**
- API keys not in Git repository
- Keys not exposed via GitHub
- Secure build process
- Access limited to Webflow users

⚠️ **Known Limitations:**
- Keys visible in browser source
- Client-side architecture constraints
- Potential for API key extraction

🔒 **Recommended:**
- Monitor API usage regularly
- Set billing alerts
- Rotate keys quarterly
- Consider backend proxy for production

**For most use cases** (internal tools, small teams, trusted users), this security model is adequate and practical. For high-security requirements or public applications, implement a backend proxy.
