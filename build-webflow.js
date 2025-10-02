#!/usr/bin/env node

/**
 * Webflow Build Script - Split Version
 *
 * Webflow has a 50,000 character limit per custom code embed.
 * This script splits the app into 3 parts:
 *
 * 1. webflow-head.html - CSS for Page Settings → Inside <head> tag
 * 2. webflow-html.html - HTML for Custom Code embed on canvas
 * 3. webflow-body.html - JavaScript for Page Settings → Before </body> tag
 *
 * Usage: npm run build:webflow
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  console.error(`${colors.red}${colors.bold}ERROR: ${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}${colors.bold}✓ ${message}${colors.reset}`);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  error('.env file not found!');
  log('\nPlease create a .env file with your API keys:', 'cyan');
  log('  1. Copy .env.example to .env', 'cyan');
  log('  2. Add your actual API keys', 'cyan');
  log('  3. Run npm run build:webflow again\n', 'cyan');
  process.exit(1);
}

// Required environment variables
const requiredVars = [
  'CLAUDE_API_KEY',
  'WEBFLOW_API_TOKEN',
  'WEBFLOW_SETTINGS_COLLECTION_ID',
  'WEBFLOW_CONTACTS_COLLECTION_ID'
];

// Validate all required variables are present
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  error('Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`  - ${colors.red}${varName}${colors.reset}`);
  });
  log('\nPlease add these to your .env file and try again.\n', 'cyan');
  process.exit(1);
}

log('\n' + '='.repeat(70), 'cyan');
log('Building Webflow Split Files', 'cyan');
log('='.repeat(70) + '\n', 'cyan');

try {
  // Read the source HTML file
  const sourceFile = 'index.html';
  log(`Reading source file: ${sourceFile}...`);

  if (!fs.existsSync(sourceFile)) {
    error(`Source file ${sourceFile} not found!`);
    process.exit(1);
  }

  let htmlContent = fs.readFileSync(sourceFile, 'utf8');

  // Replace placeholders with actual values
  log('Injecting environment variables...');

  const replacements = {
    'CLAUDE_API_KEY_PLACEHOLDER': process.env.CLAUDE_API_KEY,
    'WEBFLOW_TOKEN_PLACEHOLDER': process.env.WEBFLOW_API_TOKEN,
    'SETTINGS_COLLECTION_ID_PLACEHOLDER': process.env.WEBFLOW_SETTINGS_COLLECTION_ID,
    'CONTACTS_COLLECTION_ID_PLACEHOLDER': process.env.WEBFLOW_CONTACTS_COLLECTION_ID
  };

  // Perform replacements
  Object.entries(replacements).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder, 'g');
    const matches = (htmlContent.match(regex) || []).length;
    if (matches > 0) {
      htmlContent = htmlContent.replace(regex, value);
      log(`  ✓ Replaced ${matches} occurrence(s) of ${placeholder}`);
    }
  });

  // Extract CSS from <style> tags (including the tags)
  const styleMatch = htmlContent.match(/(<style>[\s\S]*?<\/style>)/);
  const cssContent = styleMatch ? styleMatch[1] : '';

  // Extract JavaScript from <script> tags (including the tags)
  const scriptMatch = htmlContent.match(/(<script>[\s\S]*?<\/script>)/);
  const jsContent = scriptMatch ? scriptMatch[1] : '';

  // Extract HTML body content (everything between </head> and <script>)
  const bodyMatch = htmlContent.match(/<\/head>\s*<body>([\s\S]*?)<script>/);
  const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';

  // Create output directory
  const outputDir = 'webflow-deploy';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    log(`Created output directory: ${outputDir}/`);
  }

  // Build metadata comment
  const buildDate = new Date().toISOString();
  const warningComment = `<!--
  WEBFLOW DEPLOYMENT FILE
  Part {PART} of 3
  Generated: ${buildDate}

  ⚠️  WARNING: Contains real API keys!
  - DO NOT commit to Git
  - DO NOT share publicly
  - Use only for Webflow deployment

  To rebuild: npm run build:webflow
-->

`;

  log('\nGenerating split files...');

  // 1. Create HEAD embed (CSS only)
  const headEmbed = warningComment.replace('{PART}', '1') + cssContent;
  const headFile = path.join(outputDir, 'webflow-head.html');
  fs.writeFileSync(headFile, headEmbed, 'utf8');
  const headSize = Buffer.byteLength(headEmbed, 'utf8');

  // 2. Create HTML embed (Body content only)
  const htmlEmbed = warningComment.replace('{PART}', '2') + bodyContent;
  const htmlFile = path.join(outputDir, 'webflow-html.html');
  fs.writeFileSync(htmlFile, htmlEmbed, 'utf8');
  const htmlSize = Buffer.byteLength(htmlEmbed, 'utf8');

  // 3. Create BODY embed (JavaScript only)
  const bodyEmbed = warningComment.replace('{PART}', '3') + jsContent;
  const bodyFile = path.join(outputDir, 'webflow-body.html');
  fs.writeFileSync(bodyFile, bodyEmbed, 'utf8');
  const bodySize = Buffer.byteLength(bodyEmbed, 'utf8');

  // Calculate total
  const totalSize = headSize + htmlSize + bodySize;

  success(`Webflow split files created in ${outputDir}/`);

  log(`\nFile Sizes:`, 'cyan');
  log(`  webflow-head.html: ${(headSize / 1024).toFixed(2)} KB (${headSize.toLocaleString()} chars)`);
  log(`  webflow-html.html: ${(htmlSize / 1024).toFixed(2)} KB (${htmlSize.toLocaleString()} chars)`);
  log(`  webflow-body.html: ${(bodySize / 1024).toFixed(2)} KB (${bodySize.toLocaleString()} chars)`);
  log(`  ─────────────────────────────────────────────────`);
  log(`  Total size:        ${(totalSize / 1024).toFixed(2)} KB (${totalSize.toLocaleString()} chars)`);

  // Check limits
  log(`\nWebflow Limit Check (50,000 chars per embed):`, 'cyan');
  const limit = 50000;
  let allPass = true;

  if (headSize > limit) {
    log(`  ❌ HEAD: ${headSize.toLocaleString()} chars (EXCEEDS LIMIT!)`, 'red');
    allPass = false;
  } else {
    log(`  ✓ HEAD: ${headSize.toLocaleString()} chars`, 'green');
  }

  if (htmlSize > limit) {
    log(`  ❌ HTML: ${htmlSize.toLocaleString()} chars (EXCEEDS LIMIT!)`, 'red');
    allPass = false;
  } else {
    log(`  ✓ HTML: ${htmlSize.toLocaleString()} chars`, 'green');
  }

  if (bodySize > limit) {
    log(`  ❌ BODY: ${bodySize.toLocaleString()} chars (EXCEEDS LIMIT!)`, 'red');
    allPass = false;
  } else {
    log(`  ✓ BODY: ${bodySize.toLocaleString()} chars`, 'green');
  }

  if (allPass) {
    success('\nAll files are within Webflow limits!');
  } else {
    log('\n⚠️  Some files exceed Webflow limits! Further optimization needed.', 'yellow');
  }

  log('\n' + '='.repeat(70), 'cyan');
  log('Webflow Deployment Instructions', 'green');
  log('='.repeat(70) + '\n', 'cyan');

  log('In Webflow Designer:');
  log('');
  log('1. Open your page and click the gear icon (Page Settings)');
  log('');
  log('2. Go to Custom Code tab');
  log('');
  log('3. In "Inside <head> tag" field:');
  log('   • Open: webflow-deploy/webflow-head.html');
  log('   • Copy ALL contents (Ctrl+A, Ctrl+C)');
  log('   • Paste into Webflow');
  log('');
  log('4. In "Before </body> tag" field:');
  log('   • Open: webflow-deploy/webflow-body.html');
  log('   • Copy ALL contents (Ctrl+A, Ctrl+C)');
  log('   • Paste into Webflow');
  log('');
  log('5. Save Page Settings');
  log('');
  log('6. On the page canvas:');
  log('   • Add a Custom Code element (from Add panel)');
  log('   • Open: webflow-deploy/webflow-html.html');
  log('   • Copy ALL contents (Ctrl+A, Ctrl+C)');
  log('   • Paste into the Custom Code element');
  log('');
  log('7. Publish your site!');
  log('');
  log('For detailed instructions, see: WEBFLOW-DEPLOY.md');
  log('');
  log(`Build completed: ${buildDate}`);
  log('');
  log('⚠️  SECURITY: Never commit webflow-deploy/ folder to Git!');
  log('');

} catch (err) {
  error(`Build failed: ${err.message}`);
  console.error(err);
  process.exit(1);
}
