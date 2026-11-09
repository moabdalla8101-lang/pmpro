# Production monitoring

## Stack

| Layer | Tool | Purpose |
| --- | --- | --- |
| Mobile crashes / JS errors | Sentry (`@sentry/react-native`) | Crashes, API 5xx, OTA release tags |
| API errors | Sentry (`@sentry/node`) | Unhandled exceptions, 5xx |
| Uptime | External ping of `/health` | Downtime alerts |
| Billing | RevenueCat dashboard | Purchase / entitlement issues |
| Builds / OTA | EAS | Build history, update groups |
| Device debug | Settings → About ×7 | Version, OTA id, API URL, user id |

## One-time Sentry setup

1. Create a free org at [sentry.io](https://sentry.io).
2. Create two projects:
   - **React Native** → copy DSN → set `EXPO_PUBLIC_SENTRY_DSN` in EAS production env + local `.env`
   - **Node.js / Express** → copy DSN → set `SENTRY_DSN` on Railway
3. Optional source maps: set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` in EAS secrets.
4. Redeploy API + ship a new native iOS build (Sentry native plugin).

Update `organization` / `project` in `mobile/app.json` if your Sentry slugs differ from `pmproapp` / `pmp-exam-prep-mobile`.

## Uptime (2 minutes)

Point any free monitor at:

```text
GET https://YOUR_API_HOST/health
```

Expect HTTP 200 and `"status":"ok"`. Suggested: [Better Stack](https://betterstack.com/) or [UptimeRobot](https://uptimerobot.com/) every 5 minutes, alert to email/SMS.

## Debug panel

In the app: **Settings → About** (tap 7 times quickly).

Shows build number, OTA update id, API base URL, user id. Use **Share** when a tester reports a bug. **Test Sentry** sends a sample event (production + DSN only).

## Triage flow

1. User report → ask for time + email / open debug panel share
2. Sentry → filter by user id / release / OTA dist
3. Railway logs → same timestamp + route
4. RevenueCat → if paywall / entitlement
5. Fix via OTA (JS) or new EAS build (native)
