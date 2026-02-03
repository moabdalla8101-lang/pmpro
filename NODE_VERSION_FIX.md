# Node.js Version Fix

## Issue
You're running Node.js v12.12.0, which is too old for TypeScript 5.3. The nullish coalescing operator (`??`) requires Node.js 14+.

## Solution 1: Upgrade Node.js (Recommended)

### Using Homebrew (macOS):
```bash
# Install/upgrade Node.js to latest LTS
brew install node@20
# or
brew upgrade node

# Verify version
node -v  # Should show v20.x.x or v18.x.x
```

### Using NVM (Node Version Manager):
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node -v
```

### Using Official Installer:
Download from https://nodejs.org/ (LTS version recommended)

## Solution 2: Use Compatible TypeScript Version (Temporary)

I've already updated the package.json files to use TypeScript 4.9.5 which is compatible with Node 12.

Now run:
```bash
cd backend/user-service
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Recommended Node.js Version

- **Minimum**: Node.js 14.x
- **Recommended**: Node.js 18.x or 20.x (LTS)

## After Upgrading Node.js

1. Reinstall dependencies:
```bash
cd backend/shared && rm -rf node_modules && npm install
cd ../user-service && rm -rf node_modules && npm install
cd ../content-service && rm -rf node_modules && npm install
cd ../analytics-service && rm -rf node_modules && npm install
```

2. Rebuild shared package:
```bash
cd backend/shared
npm run build
```

3. Start services:
```bash
cd backend/user-service
npm run dev
```

## Verify Installation

```bash
node -v    # Should be 14+ (preferably 18 or 20)
npm -v     # Should be 8+
```



