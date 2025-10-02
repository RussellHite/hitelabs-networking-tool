# Webflow Deployment Guide

Complete guide for deploying the Networking Follow-Up Tool to Webflow.

## Why Split Files?

Webflow has a **50,000 character limit** per custom code embed. Our app is ~58,000 characters, so we split it into 3 parts:

1. **CSS** (~8.7 KB) → Page Settings → Inside `<head>` tag
2. **HTML** (~6.1 KB) → Custom Code element on canvas
3. **JavaScript** (~42.7 KB) → Page Settings → Before `</body>` tag

All three work together as one application!

## Prerequisites

✅ You've already completed:
- Created `.env` file with your API keys
- Run `npm install`

## Step 1: Build Split Files

Run the Webflow-specific build command:

```bash
npm run build:webflow
```

This creates a `webflow-deploy/` folder with 3 files:
- `webflow-head.html` (CSS)
- `webflow-html.html` (HTML structure)
- `webflow-body.html` (JavaScript)

You should see output like:

```
✓ Webflow split files created in webflow-deploy/

File Sizes:
  webflow-head.html: 8.73 KB (8,940 chars)
  webflow-html.html: 6.36 KB (6,515 chars)
  webflow-body.html: 42.93 KB (43,956 chars)
  ─────────────────────────────────────────────────
  Total size:        58.02 KB (59,411 chars)

Webflow Limit Check (50,000 chars per embed):
  ✓ HEAD: 8,940 chars
  ✓ HTML: 6,515 chars
  ✓ BODY: 43,956 chars

✓ All files are within Webflow limits!
```

## Step 2: Deploy to Webflow

### A. Open Webflow Designer

1. Go to your Webflow project
2. Navigate to the page where you want the tool (e.g., `/networking-contacts`)
3. If you don't have a page yet, create a new blank page

### B. Add Page-Level Custom Code

1. **Open Page Settings**
   - Click the gear icon ⚙️ in the top toolbar
   - Or press `D` keyboard shortcut

2. **Go to Custom Code tab**

3. **Inside `<head>` tag field:**
   ```
   Open: webflow-deploy/webflow-head.html

   • Select ALL (Ctrl+A / Cmd+A)
   • Copy (Ctrl+C / Cmd+C)
   • Paste into Webflow "Inside <head> tag" field
   ```

4. **Before `</body>` tag field:**
   ```
   Open: webflow-deploy/webflow-body.html

   • Select ALL (Ctrl+A / Cmd+A)
   • Copy (Ctrl+C / Cmd+C)
   • Paste into Webflow "Before </body> tag" field
   ```

5. **Save Page Settings**

### C. Add HTML to Page Canvas

1. **Add Custom Code Element**
   - Click the `+` Add button in left panel
   - Find "Custom Code" under Components section
   - Drag it onto your page canvas
   - Or use keyboard shortcut: `Shift + E` → type "custom code"

2. **Paste HTML:**
   ```
   Open: webflow-deploy/webflow-html.html

   • Select ALL (Ctrl+A / Cmd+A)
   • Copy (Ctrl+C / Cmd+C)
   • Double-click the Custom Code element in Webflow
   • Paste into the code editor
   ```

3. **Configure Element:**
   - Set width: 100%
   - Set height: Auto (or 100vh if you want full viewport)
   - Position: Relative or Static

4. **Save the element**

### D. Publish

1. Click **Publish** button (top right)
2. Publish to your domain
3. Wait for publish to complete (~30 seconds)

## Step 3: Test the Deployment

### On Desktop

1. Open the published page URL in Chrome
2. Open DevTools (F12)
3. Check Console for errors
4. Verify status bar shows "✓ Ready" (green)

### On Mobile (Important!)

1. **Open on your phone:**
   - Visit the published Webflow URL
   - Should see three sections: Capture, Notes, Review

2. **Test camera:**
   - Tap "Take Photo of Card Front"
   - Allow camera permission when prompted
   - Take a photo of a business card
   - Verify image preview appears

3. **Test AI extraction:**
   - After taking photo, loading spinner should appear
   - Wait 3-5 seconds
   - Contact fields should auto-fill with extracted data
   - If fields are empty, manually type info (AI extraction failed, but app still works)

4. **Test workflow:**
   - Fill in Event Name
   - Click "Continue to Notes"
   - Notes section should unlock and scroll into view
   - Type some conversation notes
   - Click "Generate Email"
   - Wait 5-10 seconds
   - Email should appear in Review section

5. **Test mailto:**
   - Click "Open in Email App"
   - Your email app (Gmail, Mail, Outlook) should open
   - To, Subject, and Body should be pre-filled
   - Send a test email to yourself!

## Troubleshooting

### Status bar shows "Initializing..." forever

**Problem**: JavaScript didn't load or has errors

**Solutions**:
1. Check Browser Console (F12) for JavaScript errors
2. Verify `webflow-body.html` was pasted correctly in Page Settings → Before `</body>` tag
3. Ensure no extra characters or corruption when copy/pasting
4. Try rebuilding: `npm run build:webflow` and redeploy

### Page looks unstyled / broken layout

**Problem**: CSS didn't load

**Solutions**:
1. Verify `webflow-head.html` was pasted correctly in Page Settings → Inside `<head>` tag
2. Check for any Webflow styles conflicting with the app
3. Try rebuilding and redeploying CSS

### Nothing shows on the page

**Problem**: HTML content didn't load

**Solutions**:
1. Verify `webflow-html.html` is in a Custom Code element on the canvas
2. Check the element is visible (not hidden)
3. Make sure the element has sufficient height
4. Check Browser Console for errors

### Camera doesn't work

**Problem**: Camera permissions or HTTPS issue

**Solutions**:
1. Ensure page is served over HTTPS (required for camera API)
2. Check browser permissions: Settings → Site Settings → Camera → Allow
3. Try a different browser (Chrome or Safari recommended)
4. On iOS: Settings → Safari → Camera → Ask

### AI extraction fails / returns empty fields

**Problem**: Claude API issue or invalid key

**Solutions**:
1. Verify Claude API key in `.env` is correct
2. Check you have credits on your Anthropic account
3. Look at Browser Console for API error messages
4. Fallback: Manually type contact info (app still works)

### Email doesn't open in email client

**Problem**: mailto: link issue or no default email app

**Solutions**:
1. Ensure you have a default email app configured
2. Try shortening the email content (< 2000 chars total)
3. Use the clipboard fallback if prompted
4. On mobile: Make sure Mail/Gmail app is installed

### "Add Another Contact" doesn't work

**Problem**: JavaScript error or event listener issue

**Solutions**:
1. Check Browser Console for errors
2. Refresh the page and try again
3. Verify JavaScript loaded correctly

## Updating the App

When you make changes to the source code:

### 1. Edit Source Files

```bash
# Edit index.html (source with placeholders)
code index.html
```

### 2. Rebuild

```bash
npm run build:webflow
```

### 3. Redeploy to Webflow

Repeat the deployment steps above:
- Copy `webflow-head.html` → Page Settings → Head
- Copy `webflow-html.html` → Custom Code element
- Copy `webflow-body.html` → Page Settings → Body

### 4. Publish

Click Publish in Webflow

### 5. Commit Source Changes

```bash
git add index.html build-webflow.js
git commit -m "Update: description of changes"
git push
```

**Important**: Never commit the `webflow-deploy/` folder! It's gitignored.

## File Structure After Build

```
hitelabs-networking-tool/
├── index.html                    # Source (commit this)
├── build-webflow.js              # Build script (commit this)
├── .env                          # API keys (DON'T commit)
├── webflow-deploy/               # Generated files (DON'T commit)
│   ├── webflow-head.html         # CSS for <head>
│   ├── webflow-html.html         # HTML for canvas
│   └── webflow-body.html         # JavaScript for <body>
└── ...
```

## Security Reminders

### ✅ DO

- Keep `.env` file local only
- Use `npm run build:webflow` for each deployment
- Deploy from `webflow-deploy/` folder files
- Commit source files (index.html, build-webflow.js)

### ❌ DON'T

- Don't commit `.env` to Git
- Don't commit `webflow-deploy/` folder to Git
- Don't share the built files publicly
- Don't hardcode API keys in source files

## Webflow Limitations

### Character Limits

Each custom code embed is limited to **50,000 characters**:

| Location | Limit | Our Size | Status |
|----------|-------|----------|--------|
| Inside `<head>` tag | 50,000 | ~8,940 | ✅ |
| Before `</body>` tag | 50,000 | ~43,956 | ✅ |
| Custom Code element | 50,000 | ~6,515 | ✅ |

### Other Limitations

- **No external file hosting**: Can't reference external .js or .css files without a paid plan
- **No iframes from different domain**: Security restrictions
- **Cache**: Webflow caches published pages. Use Ctrl+Shift+R to hard refresh
- **Editor preview**: Custom code doesn't run in Designer preview. Must publish to test.

## Performance Tips

### Speed Up Loading

1. **Use Webflow's built-in hosting** (already fast)
2. **Minimize rebuilds** (only rebuild when source changes)
3. **Browser caching**: Users will cache CSS/JS after first visit

### Optimize Testing

1. Use Webflow's staging domain for testing before publishing to production
2. Keep DevTools open during testing to see errors immediately
3. Test on real mobile devices, not just browser emulation

## Support

### If Deployment Fails

1. Check all 3 files were copied completely (no truncation)
2. Verify `.env` has real API keys (not placeholders)
3. Review Browser Console for specific errors
4. Try incognito/private browsing to rule out cache issues

### If App Doesn't Work

1. **Check API keys are valid:**
   ```bash
   cat .env
   # Verify keys don't say "your_key_here"
   ```

2. **Rebuild:**
   ```bash
   npm run build:webflow
   ```

3. **Redeploy all 3 files** (sometimes one gets corrupted)

4. **Hard refresh browser:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Still Need Help?

- Review [SECURITY.md](SECURITY.md) for API key issues
- Check [README.md](README.md) for general troubleshooting
- Open an issue on GitHub with:
  - Browser console errors (screenshot)
  - Steps to reproduce
  - What you expected vs what happened

## Quick Reference

### Commands

```bash
# Build for Webflow (split files)
npm run build:webflow

# Build single file (for external hosting)
npm run build
```

### File Locations

```bash
# Source files (edit these)
index.html
build-webflow.js

# Generated files (deploy these)
webflow-deploy/webflow-head.html
webflow-deploy/webflow-html.html
webflow-deploy/webflow-body.html
```

### Webflow Deployment Locations

1. **Page Settings → Custom Code → Inside `<head>` tag**
   → Paste `webflow-head.html`

2. **Page Settings → Custom Code → Before `</body>` tag**
   → Paste `webflow-body.html`

3. **Canvas → Custom Code element**
   → Paste `webflow-html.html`

## Checklist

Use this checklist for each deployment:

- [ ] Run `npm run build:webflow`
- [ ] Verify all 3 files created in `webflow-deploy/`
- [ ] Check build output shows "All files are within Webflow limits!"
- [ ] Open Webflow Designer
- [ ] Page Settings → Copy `webflow-head.html` to Head
- [ ] Page Settings → Copy `webflow-body.html` to Body
- [ ] Canvas → Copy `webflow-html.html` to Custom Code element
- [ ] Save everything
- [ ] Publish site
- [ ] Test on desktop browser
- [ ] Test on mobile device
- [ ] Verify camera works
- [ ] Verify AI extraction works
- [ ] Verify email generation works
- [ ] Send test email
- [ ] Done! 🎉

---

**Version**: 1.0.0
**Last Updated**: 2025-10-02
**Build Command**: `npm run build:webflow`
