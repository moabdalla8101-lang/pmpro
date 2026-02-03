# RevenueCat Setup Guide

This guide will help you set up RevenueCat for in-app purchases in your PMP Exam Prep app.

## Prerequisites

1. RevenueCat account (sign up at https://www.revenuecat.com)
2. iOS App Store Connect account
3. Google Play Console account
4. Your app configured in both stores

## Step 1: Create RevenueCat Project

1. Log in to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Create a new project
3. Name it "PMP Exam Prep" or similar

## Step 2: Configure iOS App

1. In RevenueCat dashboard, go to **Apps** → **Add App**
2. Select **iOS**
3. Enter your bundle identifier: `com.pmpapp.examprep`
4. RevenueCat will provide an iOS API key - save this for later

### Set up App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app → **Features** → **In-App Purchases**
3. Create subscription products:
   - **Product ID**: `premium_monthly`
     - Type: Auto-Renewable Subscription
     - Duration: 1 month
     - Price: $12.49
   - **Product ID**: `premium_semi_annual`
     - Type: Auto-Renewable Subscription
     - Duration: 6 months
     - Price: $49.99
   - **Product ID**: `premium_annual`
     - Type: Auto-Renewable Subscription
     - Duration: 1 year
     - Price: $79.99
   - **Product ID**: `cram_time`
     - Type: Auto-Renewable Subscription
     - Duration: 1 week
     - Price: $9.99

4. Create a Subscription Group and add all products to it
5. In RevenueCat, go to **Apps** → Your iOS App → **App Store Connect**
6. Enter your App Store Connect Shared Secret (found in App Store Connect → Users and Access → Keys)

## Step 3: Configure Android App

1. In RevenueCat dashboard, go to **Apps** → **Add App**
2. Select **Google Play**
3. Enter your package name: `com.pmpapp.examprep`
4. RevenueCat will provide an Android API key - save this for later

### Set up Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Navigate to your app → **Monetize** → **Products** → **Subscriptions**
3. Create subscription products with the same IDs:
   - `premium_monthly` - $12.49/month
   - `premium_semi_annual` - $49.99/6 months
   - `premium_annual` - $79.99/year
   - `cram_time` - $9.99/week

4. In RevenueCat, go to **Apps** → Your Android App → **Google Play**
5. Link your Google Play service account (follow RevenueCat instructions)

## Step 4: Create Entitlements

1. In RevenueCat dashboard, go to **Entitlements**
2. Create an entitlement called **premium**
3. Attach all subscription products to this entitlement

## Step 5: Create Offerings

1. In RevenueCat dashboard, go to **Offerings**
2. Create a default offering (or use the auto-generated one)
3. Add packages for each subscription tier:
   - Monthly package → `premium_monthly` product
   - Semi-Annual package → `premium_semi_annual` product
   - Annual package → `premium_annual` product
   - Cram Time package → `cram_time` product

## Step 6: Configure Webhooks

1. In RevenueCat dashboard, go to **Project Settings** → **Webhooks**
2. Add webhook URL: `https://your-api-domain.com/api/webhooks/revenuecat`
3. Enable these events:
   - `INITIAL_PURCHASE`
   - `RENEWAL`
   - `CANCELLATION`
   - `EXPIRATION`
   - `BILLING_ISSUE`
   - `UNCANCELLATION`

4. Copy the webhook authorization header (you'll need this for backend)

## Step 7: Configure Environment Variables

### Mobile App

**Option 1: Using Test Key (Recommended for Development)**

The test API key is already configured in `app.json`:
```json
"extra": {
  "revenueCatTestApiKey": "test_GBuMzfOYeDJtjKhPcqBSwReJhZx"
}
```

This test key works for both iOS and Android during development.

**Option 2: Using Platform-Specific Keys (Production)**

Create a `.env` file in the `mobile` directory:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=your_ios_api_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=your_android_api_key_here
```

Or use a test key for both:
```bash
EXPO_PUBLIC_REVENUECAT_TEST_API_KEY=test_GBuMzfOYeDJtjKhPcqBSwReJhZx
```

Get the API keys from:
- RevenueCat Dashboard → **Apps** → Your iOS App → **API Keys**
- RevenueCat Dashboard → **Apps** → Your Android App → **API Keys**
- Test keys work for both platforms during development

### Backend

Add to your backend `.env` file:

```bash
REVENUECAT_WEBHOOK_SECRET=your_webhook_authorization_header_here
```

Get the webhook secret from:
- RevenueCat Dashboard → **Project Settings** → **Webhooks** → Authorization header

## Step 8: Install Dependencies

```bash
cd mobile
npm install
```

The RevenueCat package (`@revenuecat/purchases-expo`) is already added to `package.json`.

## Step 9: Test the Integration

### iOS Testing

1. Use a sandbox tester account in App Store Connect
2. Build and run the app on a physical iOS device or simulator
3. Try purchasing a subscription
4. Check RevenueCat dashboard for events
5. Verify webhook delivery in backend logs

### Android Testing

1. Use a test account in Google Play Console
2. Build and run the app on a physical Android device or emulator
3. Try purchasing a subscription
4. Check RevenueCat dashboard for events
5. Verify webhook delivery in backend logs

## Troubleshooting

### Common Issues

1. **"Product not available"**
   - Ensure products are created in App Store Connect/Google Play Console
   - Wait for products to be approved (can take 24-48 hours)
   - Check product IDs match exactly

2. **"Webhook not receiving events"**
   - Verify webhook URL is accessible
   - Check webhook secret is correct
   - Ensure webhook events are enabled in RevenueCat

3. **"Subscription not syncing"**
   - Check user ID mapping between RevenueCat and your backend
   - Verify sync endpoint is working: `POST /api/subscriptions/sync`
   - Check backend logs for errors

4. **"Purchase fails silently"**
   - Check RevenueCat dashboard for error details
   - Verify API keys are correct
   - Ensure app is properly configured in RevenueCat

## Next Steps

1. Set up analytics in RevenueCat dashboard
2. Configure promotional offers (if needed)
3. Set up subscription management UI
4. Test subscription renewal and cancellation flows
5. Monitor webhook delivery and subscription sync

## Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [RevenueCat Expo Guide](https://docs.revenuecat.com/docs/expo)
- [iOS In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing Guide](https://developer.android.com/google/play/billing)
