# Starting Mobile App

## Option 1: Using npx (Recommended)

```bash
cd /Users/mohamed/Documents/pmpro/mobile
npx expo start
```

## Option 2: Using npm script

```bash
cd /Users/mohamed/Documents/pmpro/mobile
npm start
```

## Option 3: Install Expo CLI globally

```bash
npm install -g expo-cli
cd /Users/mohamed/Documents/pmpro/mobile
expo start
```

## Troubleshooting

**If you see "expo: command not found":**
- Use `npx expo start` instead
- Or install globally: `npm install -g expo-cli`

**If it doesn't open automatically:**
- Look for a URL in the terminal (usually http://localhost:19000)
- Open that URL in your browser
- Or manually press `i` for iOS or `a` for Android

**If you see port errors:**
- Kill any existing Expo processes: `pkill -f expo`
- Try again

## What to Expect

After running the command, you should see:
1. Metro bundler starting
2. QR code in terminal
3. Options to press `i` or `a`
4. Expo DevTools opening in browser

Then press `i` for iOS Simulator or `a` for Android Emulator.



