# Upgrade Node.js to Run Mobile App

## Problem
Expo requires Node.js 14+ but you're running Node.js 12. The mobile app won't start without upgrading.

## Solution: Upgrade Node.js

### Option 1: Using Homebrew (Easiest)

```bash
# Install/upgrade Node.js
brew install node@20

# Or if you have node installed via brew:
brew upgrade node

# Verify
node -v  # Should show v20.x.x or v18.x.x
```

### Option 2: Using NVM (Node Version Manager)

```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell
source ~/.bashrc
# or
source ~/.zshrc

# Install Node.js 20 (LTS)
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node -v  # Should show v20.x.x
```

### Option 3: Download from Official Site

1. Go to https://nodejs.org/
2. Download the LTS version (20.x or 18.x)
3. Install the .pkg file
4. Restart terminal

## After Upgrading

1. **Reinstall mobile dependencies:**
```bash
cd /Users/mohamed/Documents/pmpro/mobile
rm -rf node_modules package-lock.json
npm install
```

2. **Start the mobile app:**
```bash
npm start
# or
npx expo start
```

3. **Press `i` for iOS or `a` for Android**

## Verify Upgrade

```bash
node -v    # Should be 14+ (preferably 18 or 20)
npm -v     # Should be 8+
```

## Why Upgrade?

- Expo requires Node.js 14+
- Better security
- Modern JavaScript features
- Better package compatibility
- Performance improvements

## Quick Check

Run this to see your current version:
```bash
node -v
```

If it shows v12.x or lower, you need to upgrade.



