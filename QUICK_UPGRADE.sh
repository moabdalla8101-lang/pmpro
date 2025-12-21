#!/bin/bash

# Quick Node.js upgrade script

echo "🔄 Upgrading Node.js..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if nvm is available
if ! command -v nvm &> /dev/null; then
    echo "❌ NVM not found. Installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Install Node.js 20
echo "📦 Installing Node.js 20..."
nvm install 20

# Use Node.js 20
echo "✅ Switching to Node.js 20..."
nvm use 20
nvm alias default 20

# Verify
echo ""
echo "✅ Node.js upgraded!"
echo "Current version: $(node -v)"
echo ""
echo "⚠️  IMPORTANT: Close and reopen your terminal, or run:"
echo "   source ~/.nvm/nvm.sh"
echo ""
echo "Then restart your services with the new Node.js version."

