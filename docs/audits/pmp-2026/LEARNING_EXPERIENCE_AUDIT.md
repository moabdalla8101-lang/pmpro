# Learning Experience, Analytics, UX, Admin, and Claims

This file covers audit phases 5 through 9. Official PMI requirements are only the exam. Study techniques below are product quality, not ECO compliance, except where the UI claims 2026 alignment.

## 5A. Practice modes

| Mode | Status | Behavior | 2026 note |
|---|---|---|---|
| Daily quiz | Implemented | 10 random active items, one completed quiz per day, resume if unfinished (`startDailyQuiz` in `examController.ts`, `DAILY_QUIZ_QUESTIONS = 10`). | No domain or approach balance. Free users draw from the free pool. |
| Mini exam | Implemented | 25 questions, 15 minutes, premium. | PMPro format. Same unweighted selector. |
| Custom / practice test | Implemented | Practice path capped at 25 on the server (`PRACTICE_EXAM_MAX_QUESTIONS`). | Count cap is enforced. Mix is not. |
| Topic practice | Partial | Practice list filters by knowledge area and by domain (`PracticeScreen.tsx`, `DomainFilterScreen.tsx`, `KnowledgeAreaFilterScreen.tsx`). | “Topic” means PMBOK knowledge area or the three stored domains, not a 2026 task. |
| Domain practice | Partial | `appendDomainFilter` in `questionController.ts` lines 31–51 accepts `People`, `Process`, and `Business` / `Business Environment`. | Filters the **old** labels. A Business session is ~9% of the bank, i.e. the old domain, not a 26% curriculum. |
| Adaptive difficulty | Missing | Every question is `medium`. Client can send a difficulty filter (`questionService.ts`) but it cannot change the set. | No ability estimate. |
| Bookmarks | Implemented | Premium. | Works on questions, not on ECO tasks. |
| Missed-question review | Implemented | Premium. `missedQuestionsSlice`. | Replays misses. Does not schedule them. |
| Full mock | Implemented | 180 / 240, premium. | See simulator audit. |
| Approach filter | Missing | `pm_approach` is stored and serialized (`questionSlice.ts`) but the practice API filters do not include it. | Cannot build a predictive-only or agile-only session. |

The Exam card’s “complete 100 questions” line is not enforced (`ExamScreen.tsx` `handleStartMockExam`).

## 5B. Explanations and feedback

| Feedback | Status |
|---|---|
| Correct-answer explanation text | Present on 923/925 items. Median explanation length in the export is about 850 characters, so most are not empty. |
| Why the other options are wrong | **Missing on 853/925.** |
| Principle being tested | Not a field. Sometimes buried in the explanation. |
| ECO domain and 2026 task | Domain string is the old domain. Task string is the old task. The review UI groups by knowledge area, not by task (`ExamReviewScreen.tsx` lines 116–128). |
| Delivery approach | Stored, not used as feedback. |
| Actionable next step after a miss | The missed list is the next step. No “study this task” link. |

Immediate feedback exists in practice (`QuestionDetailScreen`). Mock explanations arrive after submit, which is appropriate.

## 5C. Flashcards

Corpus: all 457 rows in `flashcards_export_20260203_182627.json`.

| Check | Result |
|---|---|
| Empty front or back | 0 |
| Exact duplicate fronts | 0 |
| Back shorter than 40 characters | 3 |
| Domain / 2026 task / approach metadata | None. `knowledge_area` only (`003_flashcards.sql`). |
| AI, sustainability | 0 |
| Stakeholder cards | 13 |
| Procurement cards | 5 |
| General/Other | 106 |
| Style | Term → definition (“Information Radiator”, “Prototype”, “Hierarchy Chart”). This is recognition of vocabulary, not the decision-making the ECO describes. |
| Spaced repetition | **Not implemented.** Progress columns are `times_reviewed`, `times_correct`, `times_incorrect`, `last_reviewed_at`, `is_marked`. No interval, ease, or due date. `recordReview` stores a correct/incorrect count. |
| Obsolete material | 7 cards mention process group, ITTO, or PMBOK. Not a majority. The larger issue is the missing 2026 themes, not a pile of wrong definitions. A full definition audit of 457 backs was not done card by card. |

Cards can still help vocabulary. They do not cover the 2026 outline and they do not train judgment.

## 5D. Study methods

| Method | Class | Evidence |
|---|---|---|
| Spaced repetition | Missing | Flashcard table has no schedule. |
| Active recall | Partial | Practice questions and flip cards. Cards are definitions. Questions are mostly scenarios, which is the right shape. |
| Adaptive practice | Missing | Flat difficulty; random quizzes. |
| Weak-area review | Partial | Missed questions and domain accuracy exist. Weak **task** does not. |
| Interleaving across domains | Partial | Random daily quiz interleaves by accident of the bank, which means it interleaves mostly Process. |
| Scenario-based learning | Partial | Most stems are scenarios. Case **sets** are missing. Many explanations still teach a process name. |
| Immediate feedback | Implemented | Practice reveal. |
| Periodic cumulative review | Partial | Daily quiz and full mock. No planned cumulative review by task. |
| Realistic exam conditions | Partial | 180 and 240 only. See simulator audit. |

None of the missing techniques is an official PMI requirement. The ones that change 2026 readiness most are task-level weak review and a mock that uses the published mix.

## 5E. Study plans

| Capability | Status |
|---|---|
| Exam date | Missing |
| Daily question goal | Implemented in Settings (10–200) and saved (`SettingsScreen.tsx` around lines 284–310). |
| Daily minutes goal | Implemented (same screen). |
| Personalized schedule from the date | Missing |
| Adjust plan from performance | Missing |
| Revise weak domains automatically | Missing. Domain charts are display-only. |
| Mock exam planning | Missing |
| Onboarding goals | UI exists (`OnboardingScreen.tsx`). Save is a TODO (lines 39–40). Goals are not a plan. |

Highest-value addition after content tags exist: pick an exam date, show a weekly mix that forces Business Environment and weak tasks, and schedule two full mocks. Do not build a scheduler on top of unlabeled 2021 tasks.

## 6. Analytics and readiness

What the product calculates (`progressController.ts` `updateProgress`, lines 95–138):

- Numerator and denominator are **attempt rows** in `learner_attempts`, not unique questions.
- Accuracy = correct attempts / all attempts for that certification.
- Domain breakdown uses `questions.domain` with the old normalization, else a knowledge-area fallback that maps Resource, Communications, and Stakeholder to People (`progressController.ts` around lines 675–727). That fallback **disagrees** with the 2026 People domain and also disagrees with the stored task codes (communications items are often already tagged Process).
- Streaks: `streaks` table and `/api/badges/streak` on the dashboard.
- Mock scores: list, best, and average on the Exam screen. Average skips zeros (`ExamScreen.tsx` around lines 64–73), which hides abandoned or failed-to-score exams.

What it does not calculate:

- Accuracy by 2026 task
- Accuracy by predictive vs agile vs hybrid
- Unique-question coverage
- Recency
- Difficulty (impossible today)
- A readiness index separate from raw accuracy

### How readiness overstates competence

| Mechanism | Happens? |
|---|---|
| Repeated questions | Yes. Every attempt counts. A learner who drills the free pool of 10 per knowledge area can post a high accuracy on a memorized slice. |
| Too few items | Yes. Nothing requires a minimum before showing a percentage. The UI still renders accuracy. |
| Uneven domains | Yes. Process attempts dominate, so overall accuracy is a Process score. |
| Easy selection | All items are tagged medium, and the free pool is the oldest rows, not a difficulty sample. |
| Old weights | Yes. Domain bars use the stored 8% Business tag. |
| Recent performance | No decay. A good week six months ago counts the same. |
| Duplicates | Five duplicate stems can be “two questions” in a mock and in the accuracy log. |
| False pass line | 61% on a mis-weighted, all-scored mock is shown as passing. |

### Recommended PMPro readiness model

Label it **PMPro practice readiness**, never “probability of passing the PMP.”

Use four displayed components, each with the counts behind it:

1. **Coverage.** Share of 2026 tasks with at least N distinct items attempted in the last 45 days. Publish N. Do not hide it.
2. **Recent accuracy.** Last 60 distinct items, or last 30 days, whichever is stated. First attempt and latest attempt shown separately.
3. **Mix.** Accuracy inside People, Process, and Business Environment using 2026 tags, plus predictive vs agile/hybrid once those labels are real.
4. **Full mock.** Mean of the last two completed 180-item mocks that met the domain quota. Report the mock percentage as a practice score.

Gate the headline number until coverage and at least one full mock exist. Until then show “not enough evidence.”

Do not fit a fake scaled score to PMI’s unpublished cut score.

## 7. UX and technical quality

Reviewed from code, not from a device session. A 240-minute run on a phone was **not** executed in this audit.

| Area | Finding |
|---|---|
| Onboarding | Goal checkboxes, not persisted. No exam-date or diagnostic. |
| Navigation | Tab app with Practice, Learn, Exam, Progress, Settings. Learn includes topics plus flashcards. |
| Exam setup | Clear 180 and 240. Omits breaks, item types, and “all items are scored.” |
| Readability | Standard React Native paper text. Not remeasured on a small phone here. |
| Images | Remote PrepCast URLs and `/images/...` paths. Broken covers and missing files will show as failed images. Not click-tested. |
| Accessibility | Review grid has an `accessibilityLabel`. Full screen-reader pass was not done. Drag-and-match is a poor fit for some assistive tech; no alternative input was found. |
| Responsive layout | Mobile-only product. Tablet layout not separately verified. |
| Offline | `requiresPremium` lists `offline_mode`, but no offline question cache was found in the exam flow. Treat offline as **not implemented**. Slow network: draft save is best-effort and can fail silently (`persistDraftAnswers` catch). |
| Autosave | 2 second debounce, flush on leave. |
| Crash / interruption | Resume by exam id restores questions, drafts, and wall-clock time. In-memory timer does not. |
| Sync | Progress is server-side when the request succeeds. Idempotency keys reduce duplicate practice posts. |
| Long exam performance | 180 hydrated questions are returned at start (`sealedExamQuestionsPayload`). Payload size and memory over 4 hours were **not measured**. |
| Duplicate submit | Server unique indexes and idempotency. |
| Timer expiry | Client auto-submit. Server will score a late submit. |

Edge cases not executed on a device: background for 30 minutes on the exam screen, airplane mode mid-submit, double tap submit, kill app at question 180. Code review says resume-by-id is the supported recovery path, and in-screen backgrounding favors the candidate on the clock.

## 8. Content management

Admin UI: `web-admin/src/pages/QuestionsPage.tsx`.

The form edits question text, explanation, difficulty, certification, knowledge area, answer text, correct flag, and image fields (lines 33–41 and 74–86). It does **not** edit:

- 2026 domain or task
- `pm_approach`
- question type (`select_multiple`, drag)
- case-group membership
- ECO version
- approval state
- duplicate warning

There is no review workflow, no version history, and no gap report. Import/export routes exist (`/api/import-export` in `index.ts`). Scripts under `scripts/` import from machine-local JSON and collapse domain labels to `People` / `Process` / `Business`.

Nothing stops an admin from inserting an untagged `select_one` and having `selectRandomQuestionRows` serve it on the next mock.

### Safeguards to add before new items go live

1. Required `eco_version = 2026-07`, domain, and official task id.
2. Required approach: `predictive`, `agile`, or `hybrid` (one value, not a slash combination).
3. Publish flag separate from `is_active`, default off.
4. Block publish if `select_one` has not exactly one correct option, if `select_multiple` has fewer than two, if drag metadata is unusable, or if explanation is empty.
5. Block publish on exact stem match.
6. Exam assembly reads **only** the published 2026 pool.
7. Keep the 2021-tagged rows in an archive pool that practice can use only when the learner opts into “previous outline.”

### Data model (proposal, not implemented)

- `eco_versions (id, code, published_on, people_pct, process_pct, business_pct)`
- `eco_tasks (id, eco_version_id, domain, task_number, statement)`
- `eco_enablers (id, task_id, statement)` optional
- `questions.eco_task_id`, `questions.approach`, `questions.item_type`, `questions.case_group_id`, `questions.case_position`, `questions.publish_status`, `questions.license_source`
- `question_revisions` append-only
- `exam_blueprints` storing the quotas used for a mock so results stay interpretable after the next outline change

Enablers stay optional tags. Do not require every enabler to have an item.

## 9. Claims, subscriptions, trademarks

| Claim or behavior | Supported? |
|---|---|
| App name in `TESTFLIGHT_STATUS.md`: “PMPro® - PMP® Exam Prep 2026” | The year is a product claim. The bank is the previous outline. **Not supported.** |
| Splash: “Aligned with PMI PMBOK® Guide & ECO” and a completed “ECO Weighting” checkpoint | **Not supported.** Also conflates PMBOK and the ECO. `SplashScreen.tsx` lines 122–130. |
| Learn tab: “2026 Edition” | Topics are a mindset guide plus “10 Knowledge Areas.” `LearningTopicsScreen.tsx` line 37, `LearnScreen.tsx` line 121, `learningTopics.ts` lines 202–229. **Partial at best, misleading as exam alignment.** |
| Exam tab: 180 questions, 240 minutes | **Supported** by the client constants. |
| “PMP Certification Simulation” | **Overclaims** breaks, item types, domain mix, and scoring. |
| Question count in the paywall | Paywall says “Unlimited practice questions,” not “925” or “1,000.” That wording is fair. |
| Flashcard count | Not advertised as a specific number in the paywall snippet reviewed. |
| Readiness | Legal HTML says users can “track your readiness” (`backend/server/src/routes/legal.ts` around line 153). The number is raw accuracy. **Overclaims if read as exam prediction.** |
| Non-affiliation | `PMI_DISCLAIMER` in `mobile/src/config/legal.ts` lines 9–10. Keep it adjacent to any PMI mention. Splash does not show it. |
| 3-day free trial | Paywall copy offers it (`PaywallScreen.tsx`). Comment on line 353 says the trial is an App Store introductory offer on the selected package. **This audit did not open App Store Connect or RevenueCat offerings.** Do not treat the intro offer as verified live. |
| Cancel anytime | Present in paywall disclosure copy. |
| RevenueCat | `revenueCatService.ts` identifies the user and syncs plan. Entitlement source of truth for API gates is `users.subscription_tier` plus expiry (`subscription.ts` `requirePremium`). |
| Free vs premium | Free: about 10 questions per knowledge area and short practice. Premium: full bank, mock, mini, bookmarks, missed questions. Mock route uses `requirePremiumUnlessPractice` (`backend/server/src/routes/exams.ts` lines 24–40). |
| Restore purchases | Not re-tested in this audit. Code path exists via RevenueCat sync; **NOT VERIFIED** on a device. |
| `FREE_TIER_LIMITS.MAX_MOCK_EXAMS_PER_MONTH = 1` | Defined in `subscriptionUtils.ts` lines 147–149. Mock start does not consult it; mocks are premium-only. The constant is **unused for gating**. |

Marketing compliance and exam-content compliance are separate. Fixing the paywall will not fix the bank. Shipping a correct bank while the splash still says “ECO Weighting” is done would still be a false claim.
