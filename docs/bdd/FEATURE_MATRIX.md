# Feature Access Matrix (BDD Source of Truth)

Persona × feature gates for App Store / TestFlight E2E. Derived from:

- [`mobile/src/utils/subscriptionUtils.ts`](../../mobile/src/utils/subscriptionUtils.ts)
- [`mobile/src/utils/requireAuth.ts`](../../mobile/src/utils/requireAuth.ts)
- Screen navigation gates (Practice, Exam, Progress, Learn, Settings, Paywall)
- Server gates in [`backend/server/src/__tests__/subscriptionGate.integration.test.ts`](../../backend/server/src/__tests__/subscriptionGate.integration.test.ts)

## Personas

| Persona | Auth | Entitlement | Setup |
|---------|------|-------------|-------|
| **Guest** | Not signed in | No account | Fresh install or signed out |
| **Registered Free** | Signed in | `subscriptionTier: free` | Register / login without purchase |
| **Paid Active** | Signed in | `cram_time`, `premium_monthly`, `premium_semi_annual`, or `premium_annual` with future or null expiry | RevenueCat sandbox purchase or DB-seeded premium |
| **Paid Expired** | Signed in | Premium tier name + past `subscriptionExpiresAt` | Seed expired user (treated as free for gates) |

## Legend

| Symbol | Meaning |
|--------|---------|
| Yes | Available |
| Auth | Opens Auth modal first (`useRequireAuth`) |
| Paywall | Requires Auth, then Paywall for premium |
| Limited | Available with free-tier caps |
| — | Not applicable / same as Free after expiry |

## Matrix

| Feature | Guest | Registered Free | Paid Active | Paid Expired |
|---------|-------|-----------------|-------------|--------------|
| Cold start → Main (5 tabs) | Yes | Yes | Yes | Yes |
| Forced Auth on launch | No | No | No | No |
| Practice dashboard browse | Yes | Yes | Yes | Yes |
| Today's Practice (answer) | Yes | Yes | Yes | Yes |
| Today's Practice (save / score) | Auth | Yes | Yes | Yes |
| Knowledge-area practice | Limited (~10/KA) | Limited (~10/KA) | Unlimited | Limited (~10/KA) |
| Domain practice (People / Process / Business) | Auth → Paywall | Paywall | Yes | Paywall |
| Bookmarks list / sync | Auth → Paywall | Paywall | Yes | Paywall |
| Missed questions review | Auth → Paywall | Paywall | Yes | Paywall |
| Bookmark while answering (account sync) | Auth → Paywall | Paywall | Yes | Paywall |
| Daily Quiz | Auth | Yes | Yes | Yes |
| Mini PMP exam | Auth → Paywall | Paywall | Yes | Paywall |
| Full Mock exam (180Q) | Auth → Paywall | Paywall | Yes | Paywall |
| Exam history / resume in-progress | Auth | Own exams only | Own exams | Own exams (premium types gated) |
| Progress analytics | Auth CTA | Paywall CTA | Yes | Paywall CTA |
| Learn: cheat sheet / topics | Yes | Yes | Yes | Yes |
| Learn: formulas | Yes | Yes | Yes | Yes |
| Flashcard browse / study | Yes | Yes | Yes | Yes |
| Mark flashcard / MarkedFlashcards | Auth | Yes | Yes | Yes |
| Paywall offerings / purchase | Auth first | Yes | View / manage | Renew |
| Restore purchases | Auth first | Yes | Yes | Yes |
| Settings: upgrade / plan badge | Guest profile | Upgrade | Plan name / View Subscription | Ended + Renew |
| Settings: daily goals | Local / limited | Yes | Yes | Yes |
| Sign out | — | Yes → Guest | Yes → Guest | Yes → Guest |
| Delete account | — | Yes | Yes (warns IAP not cancelled) | Yes |
| Privacy / Terms / EULA / Support links | Yes | Yes | Yes | Yes |
| PMI disclaimer | Yes | Yes | Yes | Yes |
| Offline mode | Not implemented | Not implemented | Listed as premium only; no offline cache | — |

## Free-tier limits (code)

From `FREE_TIER_LIMITS` and practice list behavior:

| Limit | Value |
|-------|-------|
| Max practice questions (global constant) | 50 |
| Max mock exams per month (constant) | 1 (UI currently gates mock entirely behind premium) |
| Bookmarks | 0 |
| Missed questions review | 0 |
| Per knowledge-area practice list | ~10 questions (`freeLimitPerKnowledgeArea` / request `limit: 10`) |

## Premium feature keys (`requiresPremium`)

`unlimited_questions`, `mock_exams`, `bookmarks`, `missed_questions`, `advanced_analytics`, `offline_mode`, `study_materials`, `domain_practice`

## Auth prompt reasons

`bookmarks`, `progress`, `exams`, `missed_questions`, `flashcards`, `paywall`, `submit_answer`, `practice_results`, `settings`, `default`

## Subscription plans (Paywall / RevenueCat)

| Plan id | Display |
|---------|---------|
| `cram_time` | Cram Time (weekly) |
| `premium_monthly` | Premium Monthly |
| `premium_semi_annual` | Premium (6 Months) |
| `premium_annual` | Premium Annual |

## Related docs

- [App Store QA Checklist](./APP_STORE_QA_CHECKLIST.md)
- Gherkin features in this folder (`01_*.feature` … `10_*.feature`)
