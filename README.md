# Hite Labs Networking Follow-Up Tool

AI-powered networking tool that captures business cards, records conversation notes, and generates personalized follow-up emails.

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd hitelabs-networking-tool

# 2. Copy environment template and add your API keys
cp .env.example .env
# Edit .env with your actual API keys

# 3. Install dependencies and build
npm install
npm run build

# 4. Deploy index-production.html to Webflow
# Copy entire file and paste into Webflow Custom Code embed
```

**Security Note**: The `.env` file and `index-production.html` are gitignored. Your API keys never touch Git. See [SECURITY.md](SECURITY.md) for details.

## Features

- 📷 **Business Card Capture**: Take photos and automatically extract contact information using Claude AI
- 🎙️ **Voice Notes**: Record or type conversation notes
- ✨ **AI Email Generation**: Generate personalized follow-up emails
- 📧 **Email Integration**: Open draft in default email client (mailto:)
- 💾 **Webflow CMS Storage**: Save all contacts to Webflow for future reference
- 📱 **Mobile-First**: Optimized for iOS Safari and Android Chrome

## Prerequisites

Before deploying, ensure you have:

1. **Claude API Key** from Anthropic (https://console.anthropic.com/)
2. **Webflow API Token** with CMS access
3. **Webflow Collections** set up:
   - "App Settings" collection with email template
   - "Networking Contacts" collection for storing contacts

## Webflow Collection Setup

### App Settings Collection

Create a collection named "App Settings" with these fields:

- `email-subject-template` (Plain Text)
- `email-body-template` (Rich Text or Plain Text)
- `calendly-url` (Link)
- `signature` (Rich Text or Plain Text)

Create one item in this collection with your template. Use these placeholders:
- `{name}` - Contact's name
- `{company}` - Contact's company
- `{event}` - Event name
- `{notes_summary}` - AI-generated summary of conversation
- `{calendly_url}` - Your Calendly link
- `{signature}` - Your email signature

**Example template:**
```
Subject: Great meeting you at {event}

Body:
Hi {name},

It was great meeting you at {event}! I really enjoyed our conversation about {notes_summary}.

At Hite Labs, I help businesses like {company} turn operational chaos into smooth workflows through custom applications and process optimization. Based on what you shared, I think there could be a great fit.

I'd love to continue the conversation - here's my calendar link: {calendly_url}

Looking forward to connecting,
{signature}
```

### Networking Contacts Collection

Create a collection named "Networking Contacts" with these fields:

- `contact-name` (Plain Text)
- `email` (Email)
- `company` (Plain Text)
- `phone` (Phone)
- `linkedin-url` (Link)
- `event-name` (Plain Text)
- `voice-notes` (Rich Text)
- `generated-email` (Rich Text)
- `email-subject` (Plain Text)
- `status` (Plain Text) - Options: "Sent", "Pending", "Follow-up"
- `card-image-front` (Image) - Optional
- `card-image-back` (Image) - Optional

## Installation & Deployment

### Step 1: Get API Keys

1. **Claude API Key**:
   - Go to https://console.anthropic.com/
   - Create an account or sign in
   - Navigate to API Keys
   - Create a new key and copy it

2. **Webflow API Token**:
   - Go to Webflow Account Settings → Integrations
   - Generate a new API token
   - Give it CMS read/write permissions
   - Copy the token

3. **Collection IDs**:
   - In Webflow Designer, go to CMS
   - Click on "App Settings" collection
   - Copy the Collection ID from the URL
   - Repeat for "Networking Contacts" collection

### Step 2: Configure Environment Variables

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** and add your real API keys:
   ```bash
   CLAUDE_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
   WEBFLOW_API_TOKEN=YOUR_WEBFLOW_TOKEN_HERE
   WEBFLOW_SETTINGS_COLLECTION_ID=YOUR_SETTINGS_COLLECTION_ID
   WEBFLOW_CONTACTS_COLLECTION_ID=YOUR_CONTACTS_COLLECTION_ID
   ```

   ⚠️ **IMPORTANT**: Never commit the `.env` file to Git! It's already in `.gitignore`.

### Step 3: Build Production File

1. **Install dependencies** (one-time setup):
   ```bash
   npm install
   ```

2. **Build the production HTML**:
   ```bash
   npm run build
   ```

   This creates `index-production.html` with your API keys injected.

3. **Verify the build**:
   - Check for `index-production.html` in your project folder
   - ⚠️ This file contains real API keys - never commit it to Git!

### Step 4: Deploy to Webflow

#### Option A: Custom Code Embed (Recommended)

1. In Webflow Designer, create a new page (e.g., "/networking-contacts")
2. Add a **Custom Code** embed element to the page
3. Open `index-production.html` and copy **everything** from `<!DOCTYPE html>` to `</html>`
4. Paste into the Custom Code element
5. Publish your site

**Note**: Always use `index-production.html` (with real keys), not `index.html` (with placeholders)!

#### Option B: External Hosting

1. Upload `index-production.html` to your web server (rename to `index.html`)
2. Ensure it's served over HTTPS
3. In Webflow, create an Embed element with an iframe:
```html
<iframe src="https://your-domain.com/networking-tool/index.html"
        style="width: 100%; height: 100vh; border: none;"
        allow="camera; microphone">
</iframe>
```

### Step 5: Test the Application

1. Open the page on your mobile device
2. Test each section:
   - ✅ Take a photo of a business card
   - ✅ Verify AI extracts contact information
   - ✅ Enter event name
   - ✅ Record or type conversation notes
   - ✅ Generate email and review
   - ✅ Click "Open in Email App" (should open email client)
   - ✅ Check Webflow CMS for saved contact

## Usage

### At a Networking Event

1. **Capture**: Take a photo of the business card (front and optionally back)
2. **Review**: AI automatically extracts contact info - edit if needed
3. **Event**: Select or type the event name
4. **Notes**: Record or type key conversation points
5. **Generate**: AI creates a personalized follow-up email
6. **Send**: Review, edit if needed, then open in your email app
7. **Next**: Click "Add Another Contact" to process the next person

### Tips for Best Results

- **Good Lighting**: Take card photos in well-lit areas
- **Centered Cards**: Keep the business card centered in frame
- **Clear Notes**: Be specific in conversation notes for better AI summaries
- **Edit Before Sending**: Always review the AI-generated email
- **Event Names**: Reuse event names for quick selection

## Troubleshooting

### Camera doesn't open
- Check browser permissions (Settings → Privacy → Camera)
- Ensure you're on HTTPS (required for camera access)
- Try a different browser

### AI extraction returns empty fields
- Retake the photo with better lighting
- Ensure the card text is clearly visible
- Manually enter the information as fallback

### Email doesn't open in client
- The mailto: link should work on most devices
- If URL is too long, try shortening your notes
- Use the clipboard fallback if prompted

### Webflow save fails
- Verify API token has CMS permissions
- Check collection IDs are correct
- Ensure all field names match exactly
- Contact will still be emailed even if save fails

### Template not loading
- Verify "App Settings" collection has at least one item
- Check API token permissions
- App will use hardcoded fallback if fetch fails

## Security Considerations

⚠️ **Important**: API keys are embedded in client-side code and visible to users.

**For Production:**
- Consider using a proxy server to hide API keys
- Set up billing alerts on Claude API
- Monitor usage regularly
- Limit Webflow token permissions to minimum required
- Rotate API keys quarterly

**Data Privacy:**
- All data is stored in your Webflow CMS
- No third-party tracking
- Images stored on Webflow CDN
- Complies with standard web privacy practices

## Browser Compatibility

**Primary Support:**
- iOS Safari 14+
- Android Chrome 90+

**Secondary Support:**
- Desktop Chrome
- Desktop Safari
- Desktop Firefox

**Known Limitations:**
- Voice recording may not work on older browsers
- mailto: behavior varies by device
- Some Android devices may limit image size

## Performance Targets

- **Page Load**: < 3 seconds on 3G
- **Image Compression**: < 2MB per image
- **AI Extraction**: 3-5 seconds average
- **Email Generation**: 5-10 seconds average
- **Total Time per Contact**: 60-90 seconds

## API Costs

**Claude API Pricing** (as of 2025):
- Claude 3.5 Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Average cost per contact: ~$0.01-0.02
- 100 contacts ≈ $1-2

**Webflow:**
- CMS API included in all paid plans
- No additional costs for API usage

## Future Enhancements

Potential features for future versions:

- [ ] Audio transcription via Whisper API
- [ ] Direct email sending (SMTP/Gmail API)
- [ ] Multiple email templates
- [ ] Contact search and filtering
- [ ] Follow-up reminders
- [ ] LinkedIn integration
- [ ] CSV export
- [ ] GoHighLevel CRM integration
- [ ] Analytics dashboard
- [ ] Team collaboration features

## Support

**Issues & Bugs**: https://github.com/[your-username]/hitelabs-networking-tool/issues

**Project Owner**: Russell Hite
**Company**: Hite Labs
**Website**: https://hitelabs.com

## License

Proprietary - © 2025 Hite Labs. All rights reserved.

## Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (single HTML file)
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Storage**: Webflow CMS API
- **Email**: mailto: protocol
- **Styling**: Embedded CSS

### Key Components

- `NetworkingApp` - Main application controller
- `ClaudeAPI` - AI service for OCR and text generation
- `WebflowAPI` - CMS integration for storage
- `CaptureSection` - Business card capture and extraction
- `NotesSection` - Conversation notes management
- `ReviewSection` - Email review and editing
- `EmailGenerator` - Template processing and personalization
- `EmailSender` - mailto: link handler

### Data Flow

1. User captures business card photo
2. Image sent to Claude API for OCR extraction
3. Contact info displayed for review/edit
4. User enters event name and conversation notes
5. Notes sent to Claude API for summarization
6. Email template fetched from Webflow
7. Template variables replaced with contact data
8. User reviews and edits generated email
9. mailto: link opens email client with draft
10. Contact data saved to Webflow CMS
11. App resets for next contact

## Development

### Local Testing

1. Open `index.html` in a browser
2. Note: Camera and some features require HTTPS
3. Use `python -m http.server 8000 --bind localhost` for local HTTPS testing
4. Or use browser's device emulation mode

### Making Changes

1. Edit `index.html` directly
2. Test locally
3. Replace configuration placeholders
4. Deploy to Webflow
5. Test on actual mobile devices

### Code Structure

The entire application is contained in a single HTML file with three main sections:

- **Styles** (lines 7-295): All CSS for responsive layout
- **HTML** (lines 296-450): Semantic structure for 3 sections
- **JavaScript** (lines 452-1150): All application logic

### Customization

**Colors**:
- Primary: `#2D5A7A` (Hite Labs blue)
- Success: `#4CAF50` (green)
- Danger: `#f44336` (red)

**Fonts**:
- System font stack for best performance

**Templates**:
- Edit in Webflow "App Settings" collection
- Changes reflect immediately

## Credits

Built with:
- [Claude AI](https://www.anthropic.com/claude) by Anthropic
- [Webflow](https://webflow.com/) CMS
- Vanilla JavaScript (no frameworks)

Developed by Russell Hite @ Hite Labs

---

**Version**: 1.0.0
**Last Updated**: 2025-10-02
