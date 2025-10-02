# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js installed (v14 or higher)
- Claude API key from https://console.anthropic.com/
- Webflow API token with CMS access
- Webflow collections set up (see main README.md)

## Setup Steps

### 1. Configure Environment Variables

```bash
# Copy the template
cp .env.example .env

# Edit .env and add your keys
nano .env  # or use any text editor
```

Your `.env` should look like:
```bash
CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
WEBFLOW_API_TOKEN=xxxxxxxxxxxxx
WEBFLOW_SETTINGS_COLLECTION_ID=xxxxxxxxxxxxx
WEBFLOW_CONTACTS_COLLECTION_ID=xxxxxxxxxxxxx
```

### 2. Build Production File

```bash
# Install dependencies (first time only)
npm install

# Build the production HTML with your keys
npm run build
```

You should see:
```
✓ Production build complete!
Output file: index-production.html
```

### 3. Deploy to Webflow

1. Open `index-production.html` in a text editor
2. Select ALL (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)
4. In Webflow Designer:
   - Go to your networking-contacts page
   - Add a Custom Code embed element
   - Paste the entire HTML
   - Save and Publish

### 4. Test

1. Open the published page on your phone
2. Take a photo of a business card
3. Verify contact info is extracted
4. Generate and send a test email

## Common Issues

### "Error: .env file not found"
Run `cp .env.example .env` then edit with your keys

### "Missing required environment variables"
Make sure all 4 variables in `.env` have real values (not placeholders)

### "Camera doesn't work"
The page must be served over HTTPS for camera access

### "Email doesn't open"
Make sure you have a default email app configured on your device

## Updating the App

When you make changes to the code:

```bash
# Edit index.html (the source file with placeholders)
# Then rebuild
npm run build

# Deploy the new index-production.html to Webflow
```

**Never edit `index-production.html` directly** - your changes will be overwritten on next build!

## Security Reminders

✅ **DO**:
- Keep `.env` file local only
- Use `npm run build` for deployments
- Deploy `index-production.html` (with keys)
- Commit `index.html` to Git (with placeholders)

❌ **DON'T**:
- Commit `.env` to Git
- Commit `index-production.html` to Git
- Share your `.env` file
- Edit `index-production.html` directly

## File Structure

```
hitelabs-networking-tool/
├── index.html              # Source (placeholders) - COMMIT THIS
├── index-production.html   # Built (real keys) - DON'T COMMIT
├── .env                    # Your API keys - DON'T COMMIT
├── .env.example            # Template - COMMIT THIS
├── build.js                # Build script - COMMIT THIS
├── package.json            # NPM config - COMMIT THIS
└── README.md               # Documentation - COMMIT THIS
```

## Workflow Summary

```
Edit source → Build → Deploy to Webflow → Git commit source
   ↓            ↓           ↓                    ↓
index.html → npm run → index-production.html → index.html only
(with        build      (with real keys,        (safe to
placeholders)           never commit)           commit)
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Review [SECURITY.md](SECURITY.md) for security best practices
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment checklist

## Need Help?

- Check the troubleshooting section in README.md
- Review console logs in browser DevTools (F12)
- Open an issue on GitHub

---

**Estimated time**: 5 minutes setup + 2 minutes per deployment

**You're ready to go!** 🚀
