# App Store QA Checklist (TestFlight Runbook)

Manual E2E pass for iOS App Store readiness. Execute scenarios from the Gherkin files in this folder. Mark **Pass / Fail / N/A** and note build number + date.

**Related:** [FEATURE_MATRIX.md](./FEATURE_MATRIX.md) · Features `01`–`10` · Backend gates: `backend/server/src/__tests__/subscriptionGate.integration.test.ts`

## Setup

| Item | Value / notes |
|------|----------------|
| Build | TestFlight / EAS production profile |
| API | Production (or staging that mirrors prod entitlements) |
| RevenueCat | Sandbox / TestFlight StoreKit |
| Date (Europe/Berlin) | |
| Tester | |
| Build number | |
| Device / iOS version | |

### Test accounts

| Persona | Account | Notes |
|---------|---------|-------|
| Guest | No account / signed out | Fresh install preferred for P0 bootstrap |
| Registered Free | | No active IAP |
| Paid Active | | Sandbox purchase (any plan) |
| Paid Expired | | Seeded expired premium or lapsed sandbox |
| Sandbox Apple ID | | For purchase + restore |

---

## P0 — Submission blockers (must pass)

| # | Scenario | Feature file | Persona | Pass | Fail | Notes |
|---|----------|--------------|---------|------|------|-------|
| 1 | Cold start → Main, 5 tabs, no forced Auth | `01_bootstrap_guest` | Guest | ☐ | ☐ | |
| 2 | Guest can open all tabs; Progress = sign-in CTA | `01_bootstrap_guest` | Guest | ☐ | ☐ | |
| 3 | Register + session survives restart | `02_auth_register_login` | Guest → Free | ☐ | ☐ | |
| 4 | Login / logout → guest Progress CTA | `02_auth_register_login` | Free | ☐ | ☐ | |
| 5 | Continue browsing as guest dismisses Auth | `02_auth_register_login` | Guest | ☐ | ☐ | |
| 6 | Privacy / Terms / EULA / Support open (Settings) | `08` / `09` | Any | ☐ | ☐ | |
| 7 | Privacy / Terms / EULA open (Paywall) | `07` / `09` | Free | ☐ | ☐ | |
| 8 | Delete account + IAP-not-cancelled warning | `08` / `09` | Free or Paid | ☐ | ☐ | Screenshot for review notes |
| 9 | PMI disclaimer visible in Settings | `08` | Any | ☐ | ☐ | |
| 10 | Paywall offerings load (Cram / Monthly / 6mo / Annual) | `07` | Free | ☐ | ☐ | |
| 11 | Guest purchase → Auth first | `07` | Guest | ☐ | ☐ | |
| 12 | Sandbox purchase unlocks premium | `07` | Free → Paid | ☐ | ☐ | Record plan used |
| 13 | Restore purchases | `07` | Paid / reinstall | ☐ | ☐ | |
| 14 | Cancel purchase sheet — no crash / stuck spinner | `07` | Free | ☐ | ☐ | |
| 15 | Manage subscriptions link | `07` | Paid | ☐ | ☐ | |
| 16 | Mock / Mini → Auth (guest) or Paywall (free) | `04` | Guest, Free | ☐ | ☐ | |
| 17 | Bookmarks / Missed / Domain → Auth or Paywall | `03` | Guest, Free | ☐ | ☐ | |
| 18 | Progress: Guest CTA / Free Paywall / Paid analytics | `06` | Guest, Free, Paid | ☐ | ☐ | |

**P0 result:** ☐ All pass · ☐ Blocked (list failing #s): _______________

---

## P1 — Core product happy paths

| # | Scenario | Feature file | Persona | Pass | Fail | Notes |
|---|----------|--------------|---------|------|------|-------|
| 19 | Today's Practice as guest → Auth at results → save after login | `03` | Guest → Free | ☐ | ☐ | |
| 20 | Guest dismiss Auth at results — no crash | `03` | Guest | ☐ | ☐ | |
| 21 | Free KA practice limited + upgrade CTA | `03` | Free | ☐ | ☐ | ~10/KA |
| 22 | Paid domain practice (People/Process/Business) | `03` | Paid | ☐ | ☐ | |
| 23 | Paid bookmark + Missed Questions after wrong answer | `03` | Paid | ☐ | ☐ | |
| 24 | Free Daily Quiz complete | `04` | Free | ☐ | ☐ | |
| 25 | Daily Quiz already completed today | `04` | Free or Paid | ☐ | ☐ | Not 403 |
| 26 | Paid Mini PMP → submit → ExamReview | `04` | Paid | ☐ | ☐ | May time-box answers |
| 27 | Paid Mock: start → leave → resume → submit | `04` | Paid | ☐ | ☐ | |
| 28 | Learn topics + Formulas as guest | `05` | Guest | ☐ | ☐ | |
| 29 | Flashcards study as guest; mark requires Auth | `05` | Guest | ☐ | ☐ | |
| 30 | Free/Paid mark flashcard → MarkedFlashcards | `05` | Free or Paid | ☐ | ☐ | |
| 31 | Settings daily goals edit | `08` | Free or Paid | ☐ | ☐ | |
| 32 | Free Upgrade / Paid View Subscription badges | `08` | Free, Paid | ☐ | ☐ | |

**P1 result:** ☐ All pass · ☐ Failures: _______________

---

## P2 — Edges / polish

| # | Scenario | Feature file | Persona | Pass | Fail | Notes |
|---|----------|--------------|---------|------|------|-------|
| 33 | Empty bookmarks / missed / exam history | `10` | Paid | ☐ | ☐ | |
| 34 | Paywall offerings failure — graceful error | `07` / `10` | Free | ☐ | ☐ | Optional: airplane mode |
| 35 | Network down on exam start/submit — Alert | `10` | Paid | ☐ | ☐ | |
| 36 | Expired premium gated like free + renew banner | `10` / `08` | Expired | ☐ | ☐ | |
| 37 | Auth reason copy differs by gate | `10` / `02` | Guest | ☐ | ☐ | |
| 38 | Splash does not block Main indefinitely | `01` | Guest | ☐ | ☐ | |

**P2 result:** ☐ All pass · ☐ Deferred / Failures: _______________

---

## Suggested single-session order

1. Fresh install → P0 #1–2 (guest shell).
2. Exercise guest Practice / Learn / Exam gates → Auth dismiss (#5, #16–17).
3. Register → Free gates (#3, #16–18, #21, #24).
4. Sandbox purchase (#10–15) → Paid Progress / Mini / bookmark (#18, #22–23, #26).
5. Settings legal + delete on a disposable account (#6–9) — do delete last on that account.
6. Optional: reinstall/restore (#13), expired seed (#36), network edges (#34–35).

## Evidence for App Review notes

Capture screenshots or short clips of:

- [ ] Guest Main (no forced login)
- [ ] Paywall with prices, trial text, Restore, legal links
- [ ] Free → Paid unlock (e.g. Progress or Mock)
- [ ] Delete account confirmation including subscription warning

## Out of scope (this checklist)

- Maestro / Detox automation
- True offline question cache (`offline_mode` not implemented)
- Unreachable in-app Onboarding screen (registered but not in current nav flow)
- Android / Play-specific billing (shared behavior may be spot-checked for parity only)

## Backend complement

Before or after the mobile pass, ensure server subscription gates still pass:

```bash
cd backend/server
npm test -- --testPathPattern=subscriptionGate
```
