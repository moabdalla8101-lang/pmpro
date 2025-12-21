# ⚡ Quick Fix for Android Emulator

## ✅ Good News: Android SDK is Installed!

The SDK exists but `ANDROID_HOME` environment variable is not set.

---

## 🚀 Quick Fix (Temporary - Current Session Only)

Run this in your terminal:

```bash
# Find Android SDK location
adb_path=$(which adb)
sdk_path=$(dirname $(dirname "$adb_path"))

# Set environment variables
export ANDROID_HOME="$sdk_path"
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Verify
echo "ANDROID_HOME=$ANDROID_HOME"
adb version
```

Then try pressing `a` in Expo terminal again.

---

## 🔧 Permanent Fix

Add to your `~/.zshrc` (or `~/.bash_profile` if using bash):

```bash
# Find your SDK path first
adb_path=$(which adb)
sdk_path=$(dirname $(dirname "$adb_path"))

# Add these lines
export ANDROID_HOME="$sdk_path"
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then reload:
```bash
source ~/.zshrc
```

---

## 🎯 Or Use iOS Simulator (Easier!)

Since you're on macOS:
- **Just press `i` in Expo terminal**
- **No setup needed!**
- **Works immediately**

---

## ✅ Verify It Works

```bash
# Check ANDROID_HOME
echo $ANDROID_HOME

# Check adb
adb version

# Check emulator
emulator -list-avds
```

---

## 📱 Start Android Emulator

```bash
# List available emulators
emulator -list-avds

# Start an emulator (replace with your emulator name)
emulator -avd <emulator-name> &

# Then press 'a' in Expo terminal
```

---

## 💡 Recommendation

**For quick testing on macOS:**
- ✅ Use **iOS Simulator** - Press `i`
- ⚠️ Android requires emulator setup

**For Android testing:**
- Use physical device with Expo Go app
- Scan QR code from Expo terminal

