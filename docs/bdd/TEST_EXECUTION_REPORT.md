# BDD E2E Test Execution Report

**Date:** 14 Nov 2026 (Europe/Berlin)  
**Branch / PR:** `cursor/bdd-e2e-scenarios-f90b` / [#33](https://github.com/moabdalla8101-lang/pmpro/pull/33)  
**Method:** 3 parallel agents — P0 static code verification, P1/P2 static code verification, backend Jest + localhost API persona smoke.

> Mobile UI was **not** exercised on iOS Simulator / TestFlight. IAP purchase/restore remain **BLOCKED** until sandbox device testing. Backend subscription gates were **executed** against local PostgreSQL.

## Verdict

Guest / Registered Free / Paid Active / Paid Expired **gate matrix is largely correct** and confirmed on the API. Fix before App Store submit:

1. **Manage Subscriptions** discoverability for paid users  
2. **Delete/abandon** for in-progress exams  
3. Complete **TestFlight sandbox IAP** (purchase + restore)

## Summary

| Scope | PASS | FAIL | PARTIAL | BLOCKED |
|-------|------|------|---------|---------|
| P0 static scenarios | 58 | 1 | 5 | 5 |
| P1/P2 static scenarios | 54 | 1 | 3 | 2 |
| **Combined scenario rows** | **112** | **2** | **8** | **7** |
| Backend gate themes (runtime) | 18/18 | 0 | — | — |

Pass rate among scored scenario rows: **~87% PASS** (112/129). Remaining are mostly IAP device blocks + partial UX gaps.

## Critical findings

| Status | ID | Finding |
|--------|-----|---------|
| FAIL | 07-6 / checklist #15 | `MANAGE_SUBSCRIPTIONS_URL` only offered after Delete Account success — not on Paywall/Settings for Paid Active |
| FAIL | 04-9 | In Progress exam cards have Resume only; delete exists only on completed history |
| PARTIAL | 08-8 / #8 | Delete-account IAP warning only when `userHasActivePremium` — Free / Expired skip warning |
| BLOCKED | 07-3 / #12–13 | Sandbox purchase + restore not run (client wiring looks correct) |

## P0 checklist results

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Cold start → Main, no forced Auth | PASS | Guest-first |
| 2 | Guest all tabs; Progress CTA | PASS | |
| 3 | Register + session restore | PASS | Device cold restart not run |
| 4 | Login / logout | PASS | |
| 5 | Continue as guest | PASS | |
| 6 | Legal links (Settings) | PASS | URLs HTTP 200 |
| 7 | Legal links (Paywall) | PASS | |
| 8 | Delete account + IAP warning | PARTIAL | Warning only if currently premium |
| 9 | PMI disclaimer | PASS | |
| 10 | Paywall offerings | PASS | Live StoreKit TBD |
| 11 | Guest purchase → Auth | PASS | |
| 12 | Sandbox purchase unlock | BLOCKED | Needs TestFlight |
| 13 | Restore purchases | BLOCKED | Control present |
| 14 | Cancel purchase sheet | PARTIAL | Code handles `userCancelled` |
| 15 | Manage subscriptions link | FAIL | Only after account delete |
| 16 | Mock/Mini gates | PASS | API 403 free mock |
| 17 | Bookmarks/Missed/Domain gates | PASS | API 403 free |
| 18 | Progress guest/free/paid | PASS | |

## Backend runtime (executed)

- PostgreSQL 16 local; migrations + 1063 imported questions  
- `subscriptionGate.integration.test.ts`: **9/9 PASS**  
- user-service auth: **3/3 PASS**  
- Persona curl smoke (free / paid DB-elevated / expired): **18/18 PASS**  
- Unrelated fail: `examIntegration` empty-drag migration assertion (not a subscription gate)

### Gate mapping

| Theme | Result |
|-------|--------|
| Free cannot start mock | PASS |
| Free can start practice | PASS |
| Free daily quiz not 403 | PASS |
| Free bookmarks/missed/domain 403 | PASS |
| Paid Active mock/bookmarks/domain | PASS |
| Paid Expired treated as free | PASS |
| Guest KA pool ≤10 | PASS |
| Unauth exam start 401 | PASS |

## Feature file rollup

| Feature | Pass | Fail | Partial | Blocked |
|---------|------|------|---------|---------|
| 01 Bootstrap | 3 | 0 | 0 | 0 |
| 02 Auth | 12 | 0 | 1 | 0 |
| 03 Practice | 13 | 0 | 1 | 0 |
| 04 Exams | 16 | 1 | 3 | 0 |
| 05 Learn | 7 | 0 | 0 | 0 |
| 06 Progress | 9 | 0 | 0 | 0 |
| 07 Paywall/IAP | 4 | 1 | 1 | 5 |
| 08 Settings | 7 | 0 | 1 | 0 |
| 09 App Review | 5 | 0 | 1 | 0 |
| 10 Edges | 8 | 0 | 0 | 2 |

## Recommended next steps

1. Add Manage Subscriptions on Paywall + Settings.  
2. Add Delete on In Progress exam cards.  
3. Show IAP-cancel warning on delete for all signed-in users (or anyone with store billing).  
4. TestFlight sandbox: purchase each plan + restore.  
5. Optional: airplane-mode exam start/submit Alerts.
