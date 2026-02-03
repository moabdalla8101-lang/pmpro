# Installing RevenueCat Package

## Important: Development Build Required

RevenueCat requires native code, so you **cannot use Expo Go**. You must create a development build.

## Installation Steps

1. **Install the packages:**
   ```bash
   cd mobile
   npm install
   ```

   This will install:
   - `react-native-purchases` - RevenueCat SDK
   - `expo-dev-client` - Required for native modules

2. **Create a development build:**

   For iOS:
   ```bash
   npx expo run:ios
   ```

   For Android:
   ```bash
   npx expo run:android
   ```

   **Important:** Do NOT use `expo start` with Expo Go. You must create a development build.

3. **If you get build errors, try:**
   ```bash
   # Clear cache
   npx expo start --clear
   
   # Or rebuild completely
   rm -rf node_modules
   npm install
   npx expo prebuild --clean
   npx expo run:ios  # or run:android
   ```

## Why Development Build?

- RevenueCat uses native iOS and Android code
- Expo Go doesn't include custom native modules
- Development builds allow you to use native modules while keeping Expo workflow

## Troubleshooting

If you see "Unable to resolve react-native-purchases":
1. Make sure you ran `npm install`
2. Make sure you're using a development build, not Expo Go
3. Try clearing cache: `npx expo start --clear`
4. Rebuild: `npx expo run:ios` or `npx expo run:android`
