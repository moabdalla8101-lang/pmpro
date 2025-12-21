# 🤖 Android Emulator Setup Guide

Guide to set up Android SDK and emulator for testing the mobile app.

---

## ⚠️ Quick Solution: Use iOS Simulator Instead

**Easiest option on macOS:**
- iOS Simulator is already included with Xcode
- No additional setup needed
- Just press `i` in Expo terminal

---

## 🚀 Option 1: Install Android Studio (Recommended)

### Step 1: Install Android Studio

1. **Download Android Studio:**
   - Go to: https://developer.android.com/studio
   - Download for macOS
   - Install the application

2. **Open Android Studio:**
   - Complete the setup wizard
   - Install Android SDK components when prompted

3. **Verify Installation:**
   ```bash
   # Check if SDK is installed
   ls ~/Library/Android/sdk
   ```

### Step 2: Set Environment Variables

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### Step 3: Create Android Virtual Device (AVD)

1. **Open Android Studio**
2. **Tools → Device Manager**
3. **Create Device**
4. **Choose a device** (e.g., Pixel 5)
5. **Download a system image** (e.g., Android 13)
6. **Finish setup**

### Step 4: Start Emulator

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <emulator-name>
```

---

## 🛠️ Option 2: Install Android SDK Only (Without Android Studio)

### Using Homebrew:

```bash
# Install Android SDK
brew install --cask android-sdk

# Set environment variables
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
source ~/.zshrc

# Install platform tools
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

---

## ✅ Verify Setup

```bash
# Check ANDROID_HOME
echo $ANDROID_HOME

# Check adb
adb version

# Check emulator
emulator -version
```

---

## 🎯 Quick Fix for Current Session

If you just want to test now without full setup:

```bash
# Set ANDROID_HOME for current session only
export ANDROID_HOME=$HOME/Library/Android/sdk

# Or if Android Studio is installed but SDK is elsewhere:
# Find it with:
find ~ -name "adb" 2>/dev/null | head -1
# Then set ANDROID_HOME to the parent directory
```

---

## 📱 Use iOS Simulator Instead (Easier!)

Since you're on macOS, iOS Simulator is much easier:

1. **Just press `i` in Expo terminal**
2. **No additional setup needed**
3. **Works immediately**

---

## 🐛 Troubleshooting

### "adb: command not found"
```bash
# Add platform-tools to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### "Emulator not found"
```bash
# Make sure emulator is in PATH
export PATH=$PATH:$ANDROID_HOME/emulator
```

### "SDK location not found"
```bash
# Create the directory if it doesn't exist
mkdir -p ~/Library/Android/sdk

# Or set ANDROID_HOME to actual location
export ANDROID_HOME=/path/to/actual/sdk
```

---

## 💡 Recommendation

**For macOS development:**
- ✅ **Use iOS Simulator** - Already installed, works immediately
- ⚠️ **Android Emulator** - Requires Android Studio setup

**For production testing:**
- Use physical Android device with Expo Go app
- Scan QR code from Expo terminal

---

## 🚀 Quick Start (iOS Simulator)

```bash
# In mobile terminal, just press:
i
```

That's it! Much simpler than Android setup.

