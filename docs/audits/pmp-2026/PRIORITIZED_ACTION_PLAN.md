# Prioritized Action Plan

No item here has been implemented. Estimates are relative: **S** under a day, **M** a few days, **L** one to two weeks, **XL** a content-authoring cycle of several weeks. Content writing is XL even when the code change is M.

P0 means: incorrect exam information, invalid scoring, a content defect that can mark a right answer wrong, or a claim that the current mock is the 2026 exam.

P1 means: the product cannot yet rehearse the 2026 outline even after the false claims are removed.

Official PMI requirements are separated from product improvements in each item.

---

## P0 — Critical

### P0-1. Remove the official-sounding 61% pass result

- **Description:** Stop telling learners they passed the PMP. Delete the comment that 61% is the PMP passing score.
- **Why it matters:** PMI’s handbook defines a criterion-referenced standard and does not publish a percentage.
- **Evidence:** `mobile/src/screens/main/ExamReviewScreen.tsx` lines 113–114 and 158–162. Handbook section “Establishing the Passing Score.”
- **Impact:** Every mock result.
- **Approach:** Show the percentage as “PMPro practice score (all items scored).” Offer bands such as “below the practice benchmark / at the practice benchmark” only if the copy says the benchmark is PMPro’s, not PMI’s. Prefer no pass/fail word until a psychometrician sets a practice cut score.
- **Dependencies:** None.
- **Effort:** S
- **Acceptance criteria:** UI and API never contain the sentence “You Passed” in relation to PMP. Tests fail if the review screen string includes “PMP passing score.”
- **Tests:** Snapshot or string test on the review component. Search test that `61` is not compared as a certification cut score.

### P0-2. Stop claiming 2026 ECO weighting until selection implements it

- **Description:** Splash checkpoint “ECO Weighting,” footer “Aligned with PMI PMBOK® Guide & ECO,” Learn “2026 Edition,” and the App Store “2026” subtitle overclaim the current bank.
- **Why it matters:** The assembler is an unweighted random draw from a previous-outline bank whose Business share is 8.9%.
- **Evidence:** `SplashScreen.tsx` lines 122–130. `LearnScreen.tsx` line 121. `selectRandomQuestionRows` in `examController.ts` lines 64–114. Export domain counts.
- **Impact:** Acquisition and trust.
- **Approach:** Either (a) change the claims now to “practice questions across People, Process, and Business Environment” with no weighting claim, or (b) ship P0-3 and P1-1 before restoring the claim. Do (a) immediately.
- **Dependencies:** Copy only for the immediate step.
- **Effort:** S for copy. L for a true claim.
- **Acceptance criteria:** No screen says the app is aligned to the ECO or that weighting is complete, unless a test proves the mock quotas.
- **Tests:** Copy lint over `mobile/src` for “ECO Weighting” and “Aligned with PMI.”

### P0-3. Remove unscorable items from any pool a learner can draw

- **Description:** `SCOPE-1` and `SCOPE-38` have no correct option and no explanation. `SCOPE-38` says choose two and is typed `select_one`. `INTEGRATION-23` and `RESOURCE-3` have empty drag metadata.
- **Why it matters:** A correct learner is marked wrong, or the item cannot be scored.
- **Evidence:** Export. `gradeQuestionResponse.ts`. Migration `009` already targets the two drag ids if applied.
- **Impact:** Practice and mocks.
- **Approach:** Confirm production `is_active`. Deactivate these four until an SME writes a real key. Add a publish check so a zero-correct `select_one` cannot be active.
- **Dependencies:** Production read access. No key should be invented in the deactivate step.
- **Effort:** S
- **Acceptance criteria:** Exam and practice queries return zero rows with `select_one` and a correct-option count other than 1, and zero active drag rows with unusable metadata.
- **Tests:** SQL or fixture test listed in the validation section below.

### P0-4. Do not score a mock as if it were domain-balanced

- **Description:** Until quotas exist, the result screen should not show People / Process / Business bars as if they were a 2026 score report. Raw accuracy can stay, with a sentence that the form was not weighted to 33/41/26.
- **Why it matters:** A strong Process performance looks like exam readiness.
- **Evidence:** `ExamReviewScreen.tsx` knowledge-area stats; `progressController.ts` domain SQL around lines 666–727.
- **Impact:** Analytics trust.
- **Approach:** Label charts “question tags currently in the bank (not 2026 exam weights).”
- **Dependencies:** None for the label. P1-1 for real weights.
- **Effort:** S
- **Acceptance criteria:** Result copy states the form was not blueprinted to the 2026 percentages.
- **Tests:** String assertion on the review header.

---

## P1 — High

### P1-1. Blueprint the full mock

- **Description:** When `examType` is `mock_exam`, draw 180 items with domain shares inside a stated tolerance of 33/41/26 and predictive share inside a stated tolerance of 40%. Refuse to start if the published pool cannot fill a quota.
- **Why it matters:** This is the actual 2026 weighting rule. PMI allows form-to-form variation and does not publish exact counts. Pick a tolerance (suggestion ±3 percentage points) and print it on the exam intro.
- **Evidence:** ECO domain table and the 40/60 note. Current selector.
- **Impact:** Every full mock.
- **Approach:** Quota sampling by `eco_task.domain` and `approach`. Do not use knowledge area as a proxy. Keep a blueprint row on the exam so later retags do not rewrite history.
- **Dependencies:** P1-2 tags on a large enough published pool. Business Environment will fail the quota until new items exist (P1-3).
- **Effort:** M for code, blocked by content.
- **Acceptance criteria:** A started mock’s stored blueprint is within tolerance. Test fails on an unweighted draw.
- **Tests:** Fixture bank with known tags; assert counts.

### P1-2. Retag to July 2026 tasks

- **Description:** Add `eco_version` and official task id. Map each current item in an SME review. Items that do not fit a 2026 task stay unpublished.
- **Why it matters:** PMI requires every form to touch every task. Domain labels alone do not prove that.
- **Evidence:** Task strings in the export are the previous 35 tasks. Schema `003_add_pmp_question_fields.sql` lines 8–9.
- **Impact:** Assembly, analytics, admin.
- **Approach:** Controlled vocabulary of the 26 tasks in `ECO_COVERAGE_MATRIX.md`. Enablers optional. Do not auto-map in production without review; the crosswalk in that file is a starting queue, not a migration script to run blindly.
- **Dependencies:** SME time. License review (P1-5) before paying to retag items that cannot ship.
- **Effort:** XL
- **Acceptance criteria:** 100% of published items have a 2026 task id. Unpublished archive retains old tags.
- **Tests:** Import rejects unknown task ids.

### P1-3. Fill Business Environment and the empty tasks

- **Description:** Author original scenarios for organizational change, continuous improvement, external environment, governance, finance (separate from resources), common vision, customer expectations, sustainability decisions, and responsible AI decisions.
- **Why it matters:** Even a generous retag leaves Business Environment near 19%, not 26%. Several tasks have no items.
- **Evidence:** `ECO_COVERAGE_MATRIX.md`.
- **Impact:** Whether a legal blueprint can start.
- **Approach:** Original scenarios only. No copying from PMI’s sample items or from commercial banks. Target the internal floor of 12 distinct items per thin task, then keep writing until the domain quota can be filled without repetition inside one exam.
- **Dependencies:** P1-2 schema so new items are not tagged “Business” with an old task code.
- **Effort:** XL
- **Acceptance criteria:** A 180-item blueprint can be filled with no duplicate stem and with every 2026 task represented at least once.
- **Tests:** Blueprint feasibility test on the published pool.

### P1-4. Split agile and hybrid

- **Description:** Replace `Agile / Hybrid` with one of `predictive`, `agile`, `hybrid`.
- **Why it matters:** The ECO’s 60% is a split, and the split percentage is **not** published. The product still needs separate labels to avoid a fake “agile” count and to let learners practice each approach in all three domains.
- **Evidence:** Export value counts.
- **Impact:** Approach quota can only enforce predictive vs “not predictive” until this is done. Do not invent a 30/30 agile/hybrid PMI rule.
- **Approach:** SME pass. Quota the published 40% predictive. Report agile and hybrid counts without claiming they match a secret PMI ratio.
- **Dependencies:** P1-2.
- **Effort:** L
- **Acceptance criteria:** No published row uses a combined approach string.
- **Tests:** Enum check.

### P1-5. Provenance hold

- **Description:** Items whose images or ids point at a commercial simulator need a license decision before they stay in market.
- **Why it matters:** Book-cover URLs on `project-management-prepcast.com` are in the export. Numeric ids resemble a third-party bank.
- **Evidence:** `QUESTION_BANK_AUDIT.md` image section.
- **Impact:** Legal exposure and any plan to “fix” those items.
- **Approach:** Inventory source. Remove unlicensed rows from the published pool. Do not paste them into new documents.
- **Dependencies:** Legal owner, not engineering alone.
- **Effort:** M to inventory, XL if a large share must be replaced.
- **Acceptance criteria:** Published pool has a recorded source and license flag.
- **Tests:** Publish job fails when `license_source` is null.

### P1-6. Duplicates

- **Description:** Deactivate one side of each exact duplicate pair after an SME confirms they are the same item.
- **Why it matters:** A mock can show the same stem twice. Accuracy double-counts.
- **Evidence:** Pairs `519657`/`519653`, `510477`/`517014`, `512565`/`517489`, `515408`/`517021`, `517581`/`518773`. Near pairs in the question audit.
- **Impact:** Exam fairness and analytics.
- **Approach:** Exact-stem unique index on publish. Human review for near pairs.
- **Dependencies:** None to deactivate exact copies.
- **Effort:** S for exact, M for near.
- **Acceptance criteria:** No two active rows share a normalized stem.
- **Tests:** Duplicate-stem test in the validation list.

### P1-7. Section model without inventing PMI’s boundary

- **Description:** If the product keeps the words “certification simulation,” add two breaks and a lock after the learner starts each break.
- **Why it matters:** July 2026 ECO: two 10-minute breaks; first after the case-study section; second about midway through independent items; no return after the break starts.
- **Evidence:** ECO exam-information section. No break code in `ExamStartScreen.tsx`.
- **Impact:** Realism. Not required for a product that honestly says “single-section practice test.”
- **Approach:** Do not ship a magic question number. Until case content exists, the honest UI is one section and no breaks, with copy that says so. When a case group exists, break 1 follows that group. Break 2 is at the midpoint of the remainder, and the intro says the midpoint is PMPro’s approximation of “approximately midway.”
- **Dependencies:** Case content for a faithful first break. Copy change can ship now.
- **Effort:** M for the state machine after the content decision. S for honest copy.
- **Acceptance criteria:** Either the simulator documents a single section, or break transitions are tested and locked.
- **Tests:** State-machine tests in the validation list. They should fail if someone hard-codes an unpublished PMI index without a comment that it is PMPro’s approximation.

### P1-8. Timer honesty

- **Description:** While the exam screen is in the background, remaining time should follow wall clock, matching the resume path.
- **Why it matters:** `setInterval` pauses; `computeRemainingSeconds` already exists but is only applied when loading a resume id.
- **Evidence:** `ExamStartScreen.tsx` lines 186–201 versus lines 150–151. `App.tsx` AppState handler does not touch the exam clock.
- **Impact:** Candidates can gain time. Server still accepts a late submit.
- **Approach:** On AppState active, recompute from `startedAt`. Optionally have the server cap credit at 240 minutes from `started_at` for mock exams. Breaks, once they exist, must pause that cap or the design is wrong.
- **Dependencies:** Product decision on whether background time counts. For exam realism, it should count.
- **Effort:** M
- **Acceptance criteria:** Backgrounding for N seconds reduces the visible timer by N ±1 second.
- **Tests:** Unit test `computeRemainingSeconds` (likely already pure). Component test with a mocked clock.

### P1-9. Multiple-response and graphic items in the blueprint

- **Description:** A 2026-style practice form should be capable of including multiple-response and graphic items. PMI does not publish how many.
- **Why it matters:** 10 and 24 in the bank means many exams contain none.
- **Evidence:** Type counts. ECO question-type list.
- **Impact:** Skill transfer to exam day.
- **Approach:** Author more original items. Optionally guarantee a small PMPro minimum and disclose it as a product choice, not a PMI count.
- **Dependencies:** Authoring, image pipeline that is not hotlinked book covers.
- **Effort:** XL
- **Acceptance criteria:** Published pool has enough of each type that a blueprint can include them without repeating.
- **Tests:** Pool composition report.

---

## P2 — Medium

### P2-1. Explanations that address the wrong options

- **Description:** For each published item, state why the chosen key is best and why each other option is weaker.
- **Why it matters:** 853 explanations do not do this. The exam rewards elimination.
- **Evidence:** Question audit.
- **Effort:** XL (writing), S (schema prompt in admin).
- **Acceptance criteria:** Publish checklist requires a non-empty rationale per option or an explicit SME waiver.
- **Tests:** Null-rationale report, not a hard fail until the backfill is done.

### P2-2. Readiness model

- **Description:** Replace raw lifetime accuracy as the headline with the four-part PMPro practice readiness in `LEARNING_EXPERIENCE_AUDIT.md`.
- **Why it matters:** Current accuracy rewards repeats and Process-heavy practice.
- **Evidence:** `progressController.ts` lines 95–108. `LEARNER_ATTEMPTS_CTE` counts every attempt.
- **Effort:** L
- **Dependencies:** P1-2 tags. Can ship a “not enough evidence” state earlier.
- **Acceptance criteria:** Headline is withheld under the published minimums and never says “chance of passing.”
- **Tests:** Fixture attempts: repeats of one question must not move coverage; they may move latest-attempt accuracy only if that rule is what the UI states.

### P2-3. Task-level progress and weak-task practice

- **Description:** Progress by the 26 tasks. A practice mode that draws from the lowest tasks.
- **Effort:** M after tags.
- **Acceptance criteria:** API returns all 26 tasks, including zeros.

### P2-4. Flashcards

- **Description:** Either retarget cards at decisions (“what should the PM do when…”) mapped to tasks, or stop implying they are 2026 exam coverage. Add sustainability, AI judgment, value, organizational change, and procurement. Procurement has 5 cards.
- **Effort:** L
- **Acceptance criteria:** Card has task id or is marked vocabulary-only in the UI.

### P2-5. Study plan

- **Description:** Persist onboarding goals. Add exam date. Suggest a weekly mix that oversamples weak tasks and Business Environment. Schedule mocks.
- **Evidence:** `OnboardingScreen.tsx` lines 39–40. Settings has daily counts only.
- **Effort:** L
- **Dependencies:** Task accuracy, or the plan will recommend Process forever.

### P2-6. Learn-topic correction

- **Description:** Rewrite “10 Knowledge Areas” so it is not presented as the exam domain map. The People mnemonic “Resource, Communications, Stakeholder” (`learningTopics.ts` lines 224–229) is not the 2026 People domain.
- **Effort:** M
- **Acceptance criteria:** A reader can distinguish knowledge areas (study vocabulary) from ECO domains (what the exam percentages mean).

### P2-7. Admin workflow

- **Description:** Fields for task, approach, item type, case group, images, publish state. Duplicate warning. Gap report. No direct insert into the live blueprint.
- **Evidence:** `QuestionsPage.tsx` form state lines 33–41.
- **Effort:** L
- **Acceptance criteria:** The safeguards in `LEARNING_EXPERIENCE_AUDIT.md` section 8 are enforced server-side, not only in the form.

### P2-8. Stale 230-minute documentation

- **Description:** `README.md` line 27 still says 230 minutes. Refresh store screenshots if they still show 230.
- **Effort:** S
- **Acceptance criteria:** Repo search for “230 minutes” in user-facing copy is empty.

### P2-9. Difficulty that means something

- **Description:** Retire the constant `medium` or replace it with a real scale used by assembly.
- **Effort:** L with SME ratings.
- **Acceptance criteria:** Difficulty is not a single value for the whole bank.

---

## P3 — Low

### P3-1. CBT-only item types

Hotspot and pull-down are official but CBT-only. A phone app may omit them if the exam intro says so. Effort L–XL. Not a content-outline failure.

### P3-2. Spaced repetition

Real intervals on flashcards. Effort M. Not an ECO requirement.

### P3-3. Offline cache

Listed as a premium feature name in `requiresPremium` but not found in the exam flow. Either build it or stop listing it. Effort L.

### P3-4. Server-side mock duration

Reject or flag submits after 240 minutes plus an allowance. Only after the background clock is correct, and only with an exception for breaks. Effort S once P1-8 exists.

### P3-5. Partial credit

Do not add it to “match PMI” unless PMI publishes a rule. If added, label it as a PMPro tutoring option, not exam scoring. Effort M.

### P3-6. Unused limit constant

`MAX_MOCK_EXAMS_PER_MONTH` is unused because mocks are premium-only. Delete or use it. Effort S.

---

## Repeatable validation (phase 10)

Run against a **copy** of the database or the JSON export. Do not update production during the audit job.

| # | Check | Expected result on a 2026-ready pool | Expected result on today’s export |
|---|---|---|---|
| 1 | Mock question count and duration constants | 180 and 240, and server rejects other counts for `mock_exam` | Client 180 and 240. Server accepts other counts. README still says 230. |
| 2 | Domain distribution of a started mock | Within the published tolerance of 33/41/26 | Unconstrained; bank is 22.8 / 68.1 / 8.9 |
| 3 | Approach distribution | Predictive within tolerance of 40%. Agile and hybrid reported separately. No claim of an unpublished split. | 50.6% predictive; one combined label |
| 4 | Task coverage | All 26 task ids present in the published pool | 0 items carry a 2026 task id |
| 5 | Duplicate stems | 0 active pairs after whitespace and case folding | 5 exact pairs |
| 6 | Missing metadata | 0 published rows missing domain, task, approach, type | 2 rows missing all three; approach not split |
| 7 | Malformed options | `select_one` has 1 correct; `select_multiple` has ≥2; no empty option text | `SCOPE-1`, `SCOPE-38`, `518741` |
| 8 | Answer references | Every correct id belongs to the question | Holds for the graded types except the zero-correct rows |
| 9 | Missing explanations | 0 published | 2 |
| 10 | Images | Every referenced file exists in the image host; no book-cover URLs | 8 book-cover style refs; external URLs not fetched |
| 11 | Break transitions | Locked previous section after break start, or product copy says there are no sections | No state machine |
| 12 | Timer | Wall clock, including background | Wall clock only on resume-by-id |
| 13 | Persistence | Draft and index survive process death | Implemented for the resume path; not device-tested here |
| 14 | Scoring | Denominator is assigned count; unanswered is wrong; client cannot send the score | Implemented and unit-tested |
| 15 | Selection | Unique ids; quotas; drag unusable rows excluded | Unique and drag filter only |
| 16 | Quality flags | Zero-correct, choose-N vs type mismatch, combined approach label, old ECO task codes | Flags fire, as in this audit |
| 17 | Import regression | Fixture import of a previous-outline row stays unpublished | Importers write straight into `questions` and shorten the domain label |

Suggested command shape for 2–10 and 16, read-only, on the export:

`node scripts/audit-pmp-2026-pool.mjs questions_export.json`

That script does not exist yet. Writing it is an implementation task, not part of this audit.
