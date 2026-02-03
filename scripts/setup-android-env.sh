#!/bin/bash

# Quick script to set up Android environment variables

echo "🤖 Setting up Android SDK environment..."

# Check if Android Studio SDK exists
if [ -d "$HOME/Library/Android/sdk" ]; then
    echo "✅ Found Android SDK at $HOME/Library/Android/sdk"
    export ANDROID_HOME=$HOME/Library/Android/sdk
elif [ -d "/Applications/Android Studio.app/Contents" ]; then
    echo "✅ Found Android Studio, checking SDK location..."
    # Try common locations
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME=$HOME/Library/Android/sdk
    else
        echo "⚠️  Android Studio found but SDK location not standard"
        echo "   Please set ANDROID_HOME manually"
        exit 1
    fi
else
    echo "❌ Android SDK not found"
    echo ""
    echo "Please install Android Studio:"
    echo "  1. Download from: https://developer.android.com/studio"
    echo "  2. Install and complete setup wizard"
    echo "  3. Run this script again"
    exit 1
fi

# Add to PATH
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Verify
echo ""
echo "✅ Environment variables set:"
echo "   ANDROID_HOME=$ANDROID_HOME"
echo ""

# Check adb
if command -v adb &> /dev/null; then
    echo "✅ adb found: $(which adb)"
    adb version
else
    echo "⚠️  adb not in PATH, but ANDROID_HOME is set"
fi

echo ""
echo "💡 To make this permanent, add to ~/.zshrc or ~/.bash_profile:"
echo "   export ANDROID_HOME=$ANDROID_HOME"
echo "   export PATH=\$PATH:\$ANDROID_HOME/emulator"
echo "   export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
echo "   export PATH=\$PATH:\$ANDROID_HOME/tools"
echo "   export PATH=\$PATH:\$ANDROID_HOME/tools/bin"



