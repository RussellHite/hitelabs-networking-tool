# Development & Deployment Workflow

Visual guide to how the build and deployment process works.

## File Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT (Local)                       │
└─────────────────────────────────────────────────────────────┘

    .env.example            .env
    (template)             (your keys)
         │                     │
         │                     │ git clone
         │                     │ cp .env.example .env
         │                     │ <edit with real keys>
         │                     │
         ▼                     ▼
    [COMMITTED]           [GITIGNORED]
         │                     │
         │                     │
         │                     ├──────────┐
         │                     │          │
    index.html            build.js   npm install
    (placeholders)        (script)       │
         │                     │          │
         │                     │          ▼
    [COMMITTED]           [COMMITTED]  node_modules/
         │                     │       [GITIGNORED]
         │                     │          │
         │                     │          │
         └──────────┬──────────┴──────────┘
                    │
                    │ npm run build
                    ▼
         index-production.html
         (real API keys injected)
                    │
             [GITIGNORED]
                    │
                    │
                    │
┌───────────────────┼─────────────────────────────────────────┐
│                   │        DEPLOYMENT                        │
│                   ▼                                          │
│                                                              │
│            Copy & Paste                                      │
│            entire file                                       │
│                   │                                          │
│                   ▼                                          │
│         ┌──────────────────┐                                │
│         │  Webflow Custom  │                                │
│         │   Code Embed     │                                │
│         └──────────────────┘                                │
│                   │                                          │
│                   │ Publish                                  │
│                   ▼                                          │
│         ┌──────────────────┐                                │
│         │  Live Website    │                                │
│         │  (with real keys │                                │
│         │   in browser)    │                                │
│         └──────────────────┘                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Git Workflow

### What Gets Committed

```
Git Repository (Safe to Push)
├── index.html ✅             # Source with placeholders
├── .env.example ✅           # Template without keys
├── build.js ✅               # Build script
├── package.json ✅           # NPM config
├── .gitignore ✅             # Ignore rules
├── README.md ✅              # Documentation
├── SECURITY.md ✅            # Security docs
├── DEPLOYMENT.md ✅          # Deployment guide
├── QUICKSTART.md ✅          # Quick start
└── WORKFLOW.md ✅            # This file
```

### What Gets Ignored

```
Local Only (Never Committed)
├── .env ⛔                   # Your real API keys
├── index-production.html ⛔ # Built file with keys
├── node_modules/ ⛔         # NPM dependencies
└── package-lock.json ⛔     # NPM lock file
```

## Development Workflow

### Initial Setup (One Time)

```bash
# 1. Clone repository
git clone <repo-url>
cd hitelabs-networking-tool

# 2. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 3. Install dependencies
npm install

# 4. Build production file
npm run build

# 5. Deploy to Webflow
# Copy index-production.html → Webflow Custom Code
```

### Making Changes

```bash
# 1. Edit source files (index.html, build.js, etc.)
code index.html

# 2. Rebuild production file
npm run build

# 3. Deploy updated file
# Copy index-production.html → Webflow Custom Code

# 4. Commit source changes to Git
git add index.html
git commit -m "Update: description of changes"
git push
```

### Team Collaboration

```bash
# Developer A makes changes:
git checkout -b feature/new-functionality
# Edit index.html
npm run build
# Deploy index-production.html to test
git commit -m "Add new feature"
git push origin feature/new-functionality

# Developer B pulls changes:
git pull origin main
# Their .env stays untouched (local only)
npm run build  # Rebuild with their own keys
# Deploy their own index-production.html
```

## Key Concepts

### 1. Source vs Production

| File | Purpose | Contains Keys | Git Status |
|------|---------|---------------|------------|
| `index.html` | Source code | Placeholders | ✅ Committed |
| `index-production.html` | Deployable | Real keys | ⛔ Gitignored |

### 2. Build Process

```
INPUT                    PROCESS              OUTPUT
─────                    ───────              ──────

.env                     build.js reads       index-production.html
(real keys)       +      .env variables   →   (keys injected)

index.html               build.js replaces
(placeholders)           placeholders
```

### 3. Environment Separation

```
┌──────────────────┐
│   Development    │
│                  │
│   Your .env      │ ← Your personal API keys
│   Your build     │ ← npm run build
│   Your deploy    │ ← Test on your Webflow
└──────────────────┘

┌──────────────────┐
│    Production    │
│                  │
│   Prod .env      │ ← Production API keys
│   Prod build     │ ← npm run build
│   Prod deploy    │ ← Deploy to live Webflow
└──────────────────┘
```

## Security Flow

### ✅ Secure (What We Do)

```
Developer's Computer
├── .env (local only)
└── index-production.html (local only)
         │
         │ Copy/Paste
         ▼
    Webflow Custom Code
         │
         │ Publish
         ▼
    Live Website (keys in browser, but not in Git)
```

### ❌ Insecure (What We Prevent)

```
Developer's Computer
├── index.html with hardcoded keys
         │
         │ git commit
         ▼
    Git Repository (PUBLIC!)
         │
         │ Forever in Git history
         ▼
    🚨 KEYS EXPOSED 🚨
```

## Troubleshooting Workflow

### "I committed .env by accident!"

```bash
# 1. Remove from Git (keeps local copy)
git rm --cached .env

# 2. Commit the removal
git commit -m "Remove .env from Git"
git push

# 3. IMPORTANT: Rotate all API keys immediately!
# - Generate new Claude API key
# - Generate new Webflow token
# - Update .env with new keys
# - npm run build
# - Redeploy to Webflow
```

### "Build not working"

```bash
# Check .env exists
ls -la .env

# Check .env has real values (not placeholders)
cat .env

# Check Node.js installed
node --version  # Should be v14+

# Reinstall dependencies
rm -rf node_modules
npm install

# Try build again
npm run build
```

### "Keys not working after deployment"

```bash
# Verify build used correct .env
cat .env  # Check values

# Rebuild
npm run build

# Check production file
grep "PLACEHOLDER" index-production.html
# Should return nothing (no placeholders)

# Redeploy fresh copy to Webflow
```

## Best Practices

### ✅ DO

1. **Always build before deploying**
   ```bash
   npm run build
   # Then copy index-production.html
   ```

2. **Commit source files only**
   ```bash
   git add index.html README.md
   git commit -m "Update feature"
   ```

3. **Keep .env local and secure**
   ```bash
   chmod 600 .env  # Restrict permissions
   ```

4. **Document changes in commit messages**
   ```bash
   git commit -m "feat: Add LinkedIn integration"
   ```

### ❌ DON'T

1. **Don't edit production file**
   ```bash
   # DON'T: Edit index-production.html
   # DO: Edit index.html, then rebuild
   ```

2. **Don't commit sensitive files**
   ```bash
   # DON'T:
   git add .env
   git add index-production.html
   ```

3. **Don't share .env**
   ```bash
   # DON'T: Email .env to team
   # DO: Share .env.example, let them add keys
   ```

4. **Don't skip the build step**
   ```bash
   # DON'T: Deploy index.html directly
   # DO: npm run build → deploy index-production.html
   ```

## Quick Reference

### Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm install` | Install dependencies | Once after clone |
| `npm run build` | Build production file | Before each deploy |
| `git add index.html` | Stage source changes | After editing source |
| `git commit -m "..."` | Commit changes | After testing |
| `git push` | Push to remote | Share with team |

### Files to Remember

| File | Safe to Edit? | Safe to Commit? |
|------|---------------|-----------------|
| `index.html` | ✅ Yes | ✅ Yes |
| `index-production.html` | ❌ No (auto-generated) | ❌ Never |
| `.env` | ✅ Yes | ❌ Never |
| `.env.example` | ✅ Yes | ✅ Yes |
| `build.js` | ✅ Yes | ✅ Yes |

## Summary

1. **Source code** (index.html) → Safe in Git
2. **API keys** (.env) → Local only
3. **Build script** (build.js) → Reads .env, injects into source
4. **Production file** (index-production.html) → Deploy only, never commit
5. **Webflow** → Receives production file with real keys

This workflow keeps your API keys **out of Git** while maintaining a **clean, collaborative codebase**.

---

**Remember**: If you're ever unsure, check `.gitignore` to see what's protected! 🔒
