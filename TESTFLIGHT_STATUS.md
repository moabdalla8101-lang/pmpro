# TestFlight Release Status

## Done

- Railway project: [pmpro-production](https://railway.com/project/9d3f1a41-b7a0-40e8-a248-13f19a3d1ca6)
- Public API: `https://api-production-92d8.up.railway.app`
- Health: `/health` returns ok
- Database migrated and seeded: 925 questions, 457 flashcards
- EAS production env:
  - `EXPO_PUBLIC_API_URL=https://api-production-92d8.up.railway.app`
  - `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_…` (set)
  - Do **not** set `EXPO_PUBLIC_REVENUECAT_TEST_API_KEY` on production (TestFlight rejects test keys)
- Test account on Railway: `testflight@pmpapp.com` / `TestFlight123!`
- Apple Developer Bundle ID: `com.pmpapp.examprep` (IAP + Push)
- App Store Connect app: [PMPro® - PMP® Exam Prep 2026](https://appstoreconnect.apple.com/apps/6814282852) (`6814282852`)
- Version 1.0 metadata saved (Prepare for Submission)
- ASC In-App Purchase key generated: Key ID `NBU9S446CN` (downloaded once; keep the `.p8` backup)
- RevenueCat project [PMPrp app](https://app.revenuecat.com/projects/fe6fcf6e/overview):
  - iOS app **PMP Exam Prep** (`com.pmpapp.examprep`) with valid IAP credentials
  - Public iOS SDK key: `appl_XxfPaVCIvDWFfdPtDiWxSNcDwcE`
  - Test Store key: `test_GBuMzf0YeDJtjKhPcqBSwReJhZx`
  - Entitlements: `premium` + existing `PMPrp app Pro` (app accepts both)
  - Default offering with Monthly / Yearly / Lifetime packages
  - Webhook **PMPro Production API** → `https://api-production-92d8.up.railway.app/api/webhooks/revenuecat` (auth matches Railway `REVENUECAT_WEBHOOK_SECRET`)

## Still required before live IAP / App Review

1. **App Store Connect subscriptions** (Monetization → Subscriptions)
   - Create subscription group + products:
     - `premium_monthly` ($12.49 / 1 month)
     - `premium_semi_annual` ($49.99 / 6 months)
     - `premium_annual` ($79.99 / 1 year)
     - `cram_time` ($9.99 / 1 week)
2. **RevenueCat App Store products** linked to those ASC product IDs (not only Test Store)
3. Attach store products to the `default` offering packages (Monthly currently shows no attached product)
4. Set Apple Server Notification URL in ASC to:
   `https://api.revenuecat.com/v1/incoming-webhooks/apple-server-to-server-notification/WwIvuxeLYHxIIofl`
5. Screenshots, privacy policy URL, App Privacy answers, review phone number

## Build + submit (TestFlight) — run locally (needs Apple login / 2FA)

```bash
cd mobile
npx eas-cli credentials:configure-build -p ios -e production
npm run build:prod:ios
npm run submit:ios
```

## Notes

- Local `.env` now includes RevenueCat test + iOS public keys (not committed).
- First TestFlight can ship without ASC subscription products; paywall store purchases need step 1–3 above.
- Do not submit for App Review until privacy, screenshots, and listing metadata are complete.
