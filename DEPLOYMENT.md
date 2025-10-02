# Deployment Checklist for Networking Follow-Up Tool

## Pre-Deployment Checklist

### ✅ Webflow Setup

- [ ] Created "App Settings" collection in Webflow with fields:
  - [ ] `email-subject-template` (Plain Text)
  - [ ] `email-body-template` (Rich Text)
  - [ ] `calendly-url` (Link)
  - [ ] `signature` (Rich Text)
- [ ] Created "Networking Contacts" collection with fields:
  - [ ] `contact-name` (Plain Text)
  - [ ] `email` (Email)
  - [ ] `company` (Plain Text)
  - [ ] `phone` (Phone)
  - [ ] `linkedin-url` (Link)
  - [ ] `event-name` (Plain Text)
  - [ ] `voice-notes` (Rich Text)
  - [ ] `generated-email` (Rich Text)
  - [ ] `email-subject` (Plain Text)
  - [ ] `status` (Plain Text)
  - [ ] `card-image-front` (Image) - Optional
  - [ ] `card-image-back` (Image) - Optional
- [ ] Added one item to "App Settings" with your email template
- [ ] Copied Collection IDs from Webflow CMS URLs

### ✅ API Keys

- [ ] Created Claude API key at https://console.anthropic.com/
- [ ] Created Webflow API token with CMS permissions
- [ ] Saved all keys securely (password manager recommended)

### ✅ Configuration

- [ ] Created `.env` file locally with actual API keys (DO NOT COMMIT)
- [ ] Opened `index.html` in editor
- [ ] Located CONFIG object (around line 405)
- [ ] Replaced all placeholders:
  - [ ] `CLAUDE_API_KEY_PLACEHOLDER` → Your actual Claude API key
  - [ ] `WEBFLOW_TOKEN_PLACEHOLDER` → Your Webflow API token
  - [ ] `SETTINGS_COLLECTION_ID_PLACEHOLDER` → App Settings collection ID
  - [ ] `CONTACTS_COLLECTION_ID_PLACEHOLDER` → Networking Contacts collection ID

### ✅ Local Testing (Optional)

- [ ] Opened `index.html` in browser
- [ ] Verified app initializes with "✓ Ready" status
- [ ] Tested camera access (requires HTTPS)
- [ ] Verified form validation works
- [ ] Checked browser console for errors

## Deployment Steps

### Method 1: Webflow Custom Code Embed (Recommended)

1. [ ] In Webflow Designer, create new page (e.g., `/networking-contacts`)
2. [ ] Add Custom Code embed element
3. [ ] Copy ENTIRE contents of `index.html` (from `<!DOCTYPE html>` to `</html>`)
4. [ ] Paste into Custom Code element
5. [ ] Set embed height to "Auto" or "100vh"
6. [ ] Save changes in Designer
7. [ ] Publish Webflow site
8. [ ] Navigate to published page URL

### Method 2: External Hosting + Iframe

1. [ ] Upload `index.html` to your web server
2. [ ] Ensure file is served over HTTPS
3. [ ] In Webflow, add Embed element with:
```html
<iframe src="https://your-domain.com/index.html"
        style="width: 100%; height: 100vh; border: none;"
        allow="camera; microphone">
</iframe>
```
4. [ ] Publish Webflow site

## Post-Deployment Testing

### ✅ Desktop Testing

- [ ] Open page in Chrome
- [ ] Open page in Safari
- [ ] Open page in Firefox
- [ ] Check for console errors (F12 → Console)
- [ ] Verify status bar shows "✓ Ready"

### ✅ Mobile Testing (Critical)

#### iOS Safari
- [ ] Open page on iPhone
- [ ] Test camera access (should prompt for permission)
- [ ] Take photo of business card
- [ ] Verify AI extraction works (loading spinner → data filled in)
- [ ] Edit contact fields
- [ ] Enter event name
- [ ] Type conversation notes (voice recording may not work on all iOS versions)
- [ ] Generate email (verify loading → email appears)
- [ ] Edit email
- [ ] Click "Open in Email App" (should open Mail app)
- [ ] Verify To, Subject, Body are pre-filled
- [ ] Check Webflow CMS for saved contact

#### Android Chrome
- [ ] Open page on Android device
- [ ] Repeat all iOS tests above
- [ ] Verify camera uses rear camera by default
- [ ] Test voice recording (should work)
- [ ] Verify microphone permission prompt

### ✅ End-to-End Test

Complete one full contact flow:

1. [ ] Take photo of business card
2. [ ] AI extracts contact info successfully
3. [ ] Enter event name: "Test Event"
4. [ ] Enter notes: "Discussed AI tools and automation"
5. [ ] Click "Continue to Notes"
6. [ ] Notes section unlocks and scrolls into view
7. [ ] Type or record conversation notes
8. [ ] Click "Generate Email"
9. [ ] Email generates in 5-10 seconds
10. [ ] Review and edit email
11. [ ] Click "Open in Email App"
12. [ ] Email client opens with pre-filled content
13. [ ] Close email app
14. [ ] Check Webflow CMS for new contact entry
15. [ ] Verify all fields saved correctly
16. [ ] Click "Add Another Contact"
17. [ ] Form resets but event name persists
18. [ ] Ready for next contact

### ✅ Error Testing

- [ ] Deny camera permission → Shows helpful error message
- [ ] Take blurry photo → Manual entry still works
- [ ] Leave required fields empty → Validation prevents proceeding
- [ ] Disconnect internet → Shows network error
- [ ] Reconnect and retry → Works after reconnection

## Troubleshooting

### Camera doesn't work
**Problem**: Camera button does nothing or shows error

**Solutions**:
- Ensure page is served over HTTPS (required for camera API)
- Check browser permissions: Settings → Site Settings → Camera
- Try different browser
- On iOS: Settings → Safari → Camera → Ask

### AI extraction fails
**Problem**: Contact fields remain empty after photo

**Solutions**:
- Check Claude API key is correct
- Verify API key has credits/billing enabled
- Check browser console for API errors
- Manually enter contact info as fallback

### Email doesn't open
**Problem**: "Open in Email App" doesn't launch email client

**Solutions**:
- Verify default email app is set on device
- Try shortening email body (< 2000 chars total)
- Use clipboard fallback if prompted
- Manually copy/paste email content

### Webflow save fails
**Problem**: Contact doesn't appear in CMS

**Solutions**:
- Verify Webflow API token is correct
- Check token has CMS write permissions
- Verify collection IDs are correct
- Check field names match exactly (case-sensitive)
- Review browser console for error details

### Template not loading
**Problem**: Email uses generic fallback template

**Solutions**:
- Verify "App Settings" collection has at least one item
- Check all template fields are filled in
- Verify Settings Collection ID is correct
- Check Webflow API token permissions

## Security Checklist

### ⚠️ Before Going Live

- [ ] API keys are working correctly
- [ ] Keys are from your personal account (not shared)
- [ ] Billing is enabled on Claude account
- [ ] Spending limits set on Claude account
- [ ] Webflow API token limited to necessary permissions only
- [ ] Consider using environment variable injection instead of hardcoded keys
- [ ] Set up API usage monitoring/alerts

### 🔒 Ongoing Security

- [ ] Monitor Claude API usage weekly
- [ ] Review Webflow CMS access logs
- [ ] Rotate API keys quarterly
- [ ] Keep backup of working configuration
- [ ] Document any issues in GitHub

## Performance Checklist

- [ ] Page loads in < 3 seconds on mobile
- [ ] Images compress to < 2MB
- [ ] AI extraction completes in 3-5 seconds
- [ ] Email generation completes in 5-10 seconds
- [ ] No console errors or warnings

## Final Verification

- [ ] All placeholders replaced with actual values
- [ ] No `PLACEHOLDER` text remains in code
- [ ] `.env` file is NOT committed to Git
- [ ] `.gitignore` includes `.env`
- [ ] README.md updated with any custom instructions
- [ ] Tested on at least 2 different mobile devices
- [ ] Tested with at least 3 real business cards
- [ ] Team members can access and use the tool
- [ ] Webflow CMS contacts are viewable and accurate

## Post-Launch Monitoring

### Week 1
- [ ] Check API usage daily
- [ ] Review any error logs
- [ ] Gather user feedback
- [ ] Test on additional devices as needed

### Monthly
- [ ] Review total API costs
- [ ] Check Webflow CMS data integrity
- [ ] Update email templates if needed
- [ ] Rotate API keys

### Quarterly
- [ ] Full security audit
- [ ] Performance review
- [ ] User feedback analysis
- [ ] Consider feature additions

## Support Resources

**Documentation**: See README.md for detailed setup instructions

**Claude API Docs**: https://docs.anthropic.com/
**Webflow API Docs**: https://developers.webflow.com/

**Issues**: Report bugs at GitHub repository

## Rollback Plan

If deployment fails or critical issues arise:

1. [ ] Save working version of `index.html` before changes
2. [ ] Keep backup of API keys
3. [ ] Document what changed
4. [ ] Revert to previous version in Webflow
5. [ ] Test previous version still works
6. [ ] Investigate issue offline
7. [ ] Fix and re-deploy when ready

---

## Success Criteria

✅ Deployment is successful when:

- App loads without errors
- Camera captures business cards
- AI extracts contact information
- Email generates with personalization
- mailto: opens email client correctly
- Contacts save to Webflow CMS
- Can process multiple contacts in sequence
- Works on both iOS and Android devices

**Ready to deploy?** Follow the checklist above step-by-step!

---

**Last Updated**: 2025-10-02
**Version**: 1.0.0
