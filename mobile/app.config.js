module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL || '',
    revenueCatTestApiKey: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || '',
    revenueCatIosApiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '',
    revenueCatAndroidApiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '',
  },
});
