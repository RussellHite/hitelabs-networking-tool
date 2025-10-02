#!/usr/bin/env node

/**
 * Build Script for Networking Follow-Up Tool
 *
 * This script reads API keys from .env file and generates
 * index-production.html with keys injected, ready for deployment.
 *
 * Usage: npm run build
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ANSI color codes for terminal output
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

function warning(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  error('.env file not found!');
  log('\nPlease create a .env file with your API keys:', 'cyan');
  log('  1. Copy .env.example to .env', 'cyan');
  log('  2. Add your actual API keys', 'cyan');
  log('  3. Run npm run build again\n', 'cyan');
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

// Check for placeholder values
const placeholderPatterns = [
  'your_key_here',
  'your_token_here',
  'your_collection_id',
  'placeholder'
];

const hasPlaceholders = requiredVars.some(varName => {
  const value = process.env[varName].toLowerCase();
  return placeholderPatterns.some(pattern => value.includes(pattern));
});

if (hasPlaceholders) {
  error('Found placeholder values in .env file!');
  log('\nPlease replace all placeholder values with your actual API keys.\n', 'cyan');
  process.exit(1);
}

log('\n' + '='.repeat(60), 'cyan');
log('Building Production HTML with API Keys', 'cyan');
log('='.repeat(60) + '\n', 'cyan');

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

    if (matches === 0) {
      warning(`Placeholder "${placeholder}" not found in source file`);
    } else {
      htmlContent = htmlContent.replace(regex, value);
      log(`  ✓ Replaced ${matches} occurrence(s) of ${placeholder}`);
    }
  });

  // Verify no placeholders remain
  const remainingPlaceholders = htmlContent.match(/[A-Z_]+_PLACEHOLDER/g);
  if (remainingPlaceholders) {
    warning('Found unreplaced placeholders:');
    [...new Set(remainingPlaceholders)].forEach(p => {
      console.log(`  - ${p}`);
    });
  }

  // Add build metadata comment at the top
  const buildDate = new Date().toISOString();
  const buildComment = `<!--
  PRODUCTION BUILD
  Generated: ${buildDate}

  ⚠️  WARNING: This file contains real API keys!
  - DO NOT commit this file to Git
  - DO NOT share this file publicly
  - Use only for deployment to Webflow

  To rebuild: npm run build
-->\n\n`;

  htmlContent = buildComment + htmlContent;

  // Write production file
  const outputFile = 'index-production.html';
  log(`\nWriting production file: ${outputFile}...`);
  fs.writeFileSync(outputFile, htmlContent, 'utf8');

  // Calculate file size
  const stats = fs.statSync(outputFile);
  const fileSizeKB = (stats.size / 1024).toFixed(2);

  success(`Production build complete!`);
  log(`\nBuild Details:`, 'cyan');
  log(`  Output file: ${outputFile}`);
  log(`  File size: ${fileSizeKB} KB`);
  log(`  Build time: ${buildDate}`);

  log('\n' + '='.repeat(60), 'cyan');
  log('Next Steps:', 'green');
  log('='.repeat(60) + '\n', 'cyan');

  log('1. Open index-production.html in a text editor');
  log('2. Copy ALL contents (Ctrl+A, Ctrl+C)');
  log('3. In Webflow Designer:');
  log('   - Add Custom Code embed element');
  log('   - Paste the entire content');
  log('   - Save and Publish');
  log('\n⚠️  SECURITY: Never commit index-production.html to Git!\n');

} catch (err) {
  error(`Build failed: ${err.message}`);
  console.error(err);
  process.exit(1);
}
