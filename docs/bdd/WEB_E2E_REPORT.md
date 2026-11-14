# Web E2E Report (Expo web on Linux VM)

**When:** 14 Nov 2026 (Europe/Berlin)  
**App:** `http://localhost:8081` (Expo web)  
**API:** `http://localhost:3001`  
**Runner:** Playwright Chromium  

## Summary

| Status | Count |
|--------|------:|
| PASS | 24 |
| FAIL | 1 |
| PARTIAL | 1 |
| SKIP | 4 |
| **Total** | **30** |

## Verdict

Expo **web can exercise most non-IAP BDD gates** on this Linux VM. Guest shell, free paywalls, paid unlocks (via DB-elevated account + session inject), Progress analytics, Domain practice, and Mini exam start all passed in the browser.

**Still not App Store–complete:** StoreKit / RevenueCat purchase + restore are unavailable on web (`Skipping RevenueCat initialization in this runtime`).

## FAIL / PARTIAL / SKIP

| ID | Status | Notes |
|----|--------|-------|
| 07-6 | FAIL | Manage Subscription not on Settings/Paywall for paid users (product gap; only after delete) |
| 02-1 | PARTIAL | Auth modal / dismiss flaky under automation; guest continue path exists |
| 07-3 / 07-5 | SKIP | IAP purchase / restore — RC skipped on web |
| 08-8 | SKIP | Destructive delete skipped |
| 10-5 | SKIP | Network-failure simulation not run |

## Passed highlights

- Guest: Main 5 tabs, no forced Auth; Progress CTA; Practice/Learn/Formulas; Domain Auth/Paywall; Daily Quiz / Mock Auth; legal + PMI  
- Free: Progress → Paywall; Mock/Mini → Paywall; Bookmarks/Missed → Paywall; Daily Quiz not Paywall; Paywall shows Cram/Monthly/6mo/Annual + Restore  
- Paid (DB `premium_monthly`): Settings badge; Progress analytics; Mini → ExamStart; Domain People/Process/Business  
- Logout → guest Progress CTA  

## Method notes

1. Paper `TextInput` login/register is unreliable under Playwright on RN-web; free/paid sessions used **API login + `localStorage` token/user inject** before boot (same keys as AsyncStorage).  
2. Exam CTAs are **Start Mock Exam / Start Mini PMP / Start Daily Quiz** (not bare “Mock Exam”).  
3. Do not leave Playwright `addInitScript` session inject sticky across logout tests — it re-seeds storage on every navigation.

## Artifacts

- Results JSON: `/tmp/bdd-web/results.json` (on agent VM)  
- Screenshots: `/tmp/bdd-web/v2-*.png`, `r-*.png`, `probe-*.png`
