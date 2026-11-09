# Technical implementation plan

No question wording, option, key, or explanation should change for these items. Where a row must leave the live pool, set `is_active` or exclude it in the selector. Do not rewrite it.

Effort: **S** under a day, **M** a few days, **L** one to two weeks. Estimates assume the proposed map in `proposed_eco_mappings.jsonl` is the starting crosswalk.

## Minimum set for a responsible launch

Do these before calling the product a 2026 exam simulator. They do not require new questions.

1. **Stop the false pass.** Remove `passThreshold = 61` and “You Passed” as a PMP result.
2. **Stop the false weighting claim** until selection actually quotas domains. Splash checkpoint “ECO Weighting” and “Aligned with PMI PMBOK® Guide & ECO” come out now.
3. **Keep unscorable rows and exact duplicate stems out of new exams.** Four broken items and five duplicate pairs.
4. **Say what the mock is.** One section, all 180 items scored, practice score, no PMI cut score, breaks not yet simulated. Do not invent the case-study boundary.
5. **Weight the full mock** with the task crosswalk (selection-time, no stem edits) **or** do not claim a domain-weighted exam. Weighting before the instructor reviews the 558-row queue is acceptable only if the exam intro says the domain map is PMPro’s translation of the current task labels.

Items that can wait: section breaks, case groups, hotspot, spaced repetition, study-plan dates, flashcard rewrites, a new readiness formula, admin ECO fields.

## Fixes that do not edit question content

### 1. Remove the unofficial 61% pass

- **Why:** The PMI handbook uses a psychometric standard. No percentage is published.
- **Files:** `mobile/src/screens/main/ExamReviewScreen.tsx` (lines 113–114, 158–162). Search for `61` and “Passed” in `mobile/src/screens/main/ExamScreen.tsx` if a pass badge is repeated there.
- **Change:** Show “PMPro practice score. All assigned items were scored. This is not a PMI result.” Drop pass/fail color that implies certification.
- **Complexity:** S
- **Tests:** Component or string test fails if the review screen contains “PMP passing score” or “You Passed.”

### 2. Result messaging

- Same screen as above, plus the score hero colors.
- **Files:** `ExamReviewScreen.tsx`. Domain bars on that screen are knowledge areas (`lines 116–128`), not 2026 domains.
- **Change:** Label knowledge-area charts as topic practice, not as the PMI domain score report. After weighting exists, add People / Process / Business Environment from the blueprint stored on the exam.
- **Complexity:** S for copy. M once the blueprint is stored.
- **Tests:** A finished mock fixture shows the practice-score sentence and does not say the candidate passed the PMP.

### 3. Domain-weighted selection

- **Why:** `selectRandomQuestionRows` is `ORDER BY RANDOM()` (`backend/server/src/controllers/examController.ts` lines 64–114).
- **Change without retagging rows:** At selection time, map `questions.task` through the crosswalk in `REASSESSMENT.md` to a 2026 domain. Fill quotas within ±3 percentage points of 33/41/26 for `examType = mock_exam`. Refuse to start if a quota cannot be filled. Store the counts on the exam row.
- **Also quota approach** at about 40% predictive, using `proposed_approach` logic or a column added later. Do not invent an official agile-versus-hybrid split. Report both counts.
- **Files:** `examController.ts` (`selectRandomQuestionRows`, `startExam`). New helper, for example `backend/server/src/utils/ecoCrosswalk.ts`. Tests in `backend/server/src/__tests__/examIntegration.test.ts`.
- **Do not** use knowledge area as the domain.
- **Complexity:** M
- **Tests:** Fixture with known tasks. A 180-start returns counts inside tolerance. A second start does not repeat a question id. Unscorable ids are absent. Exact duplicate stems are not both present.

### 4. Wall-clock timer and server deadline

- **Why:** The interval in `mobile/src/screens/main/ExamStartScreen.tsx` (lines 186–201) pauses in the background. `computeRemainingSeconds` in `mobile/src/utils/examSubmitHelpers.ts` (lines 65–73) is applied on resume-by-id only (around lines 150–151). `submitExam` does not read `started_at` against 240 minutes.
- **Change:** On `AppState` “active,” recompute remaining time from `startedAt`. On submit, if `exam_type` is `mock_exam` and elapsed time exceeds 240 minutes plus a small grace, score what was saved and reject further edits. Do not add break time to that cap until breaks exist.
- **Files:** `ExamStartScreen.tsx`, `examSubmitHelpers.ts`, `examController.ts` `submitExam`, existing timer tests around `examSubmitHelpers`.
- **Complexity:** M
- **Tests:** Pure test: 30 minutes of “background” reduces remaining time by 30 minutes. Integration: submit after the cap is still scored once, and a second submit does not raise the score.

### 5. Breaks, section navigation, and locking

- **Why:** The July 2026 ECO specifies two 10-minute breaks, the first after the case-study section and the second about midway through the independent items, with no return after the break starts. It does not publish the indexes.
- **Do not** hard-code a question number and call it PMI’s boundary.
- **Launch change:** Copy only. Call the current exam a single-section practice test. Files: `mobile/src/screens/main/ExamScreen.tsx` (the “PMP Certification Simulation” subtitle, lines 178–182), `ExamStartScreen.tsx` intro.
- **Later change, when a case group exists:** Section state on `mock_exams` (`section_index`, `break_ends_at`, `locked_through_position`). Review grid cannot open a locked position. Break countdown is 10 minutes and does not consume the 240. Second break at the midpoint of the unlocked remainder, labeled as PMPro’s reading of “approximately midway.”
- **Complexity:** S for the honest label. L for the state machine. Blocked on a real case section if the first break is to match the ECO rather than an arbitrary split.
- **Tests:** State machine: start break → previous items read-only; resume from background restores break end; timer does not drop during the break.

### 6. Duplicate prevention

- **Why:** Five exact stem pairs can both be drawn.
- **Change:** Normalize stem (case, whitespace) in the selector and keep one id per stem. Do not delete the duplicate row in this pass.
- **Files:** `examController.ts` `selectRandomQuestionRows`. Optional unique index is a content migration; skip it if the rule is “do not touch question records.”
- **Complexity:** S
- **Tests:** Fixture with two identical stems returns one.

### 7. Analytics on the 2026 map

- **Why:** `progressController.ts` (domain SQL around lines 666–727) buckets stored `domain`, and the knowledge-area fallback calls Resource, Communications, and Stakeholder “People.” That fallback is not the 2026 People domain.
- **Change:** Use the same crosswalk as the exam selector. Report accuracy by proposed domain and by proposed task code. Keep attempt-level accuracy, but label it as all attempts, not unique questions. Do not show a pass probability.
- **Files:** `backend/server/src/controllers/progressController.ts`, `mobile/src/screens/main/ProgressScreen.tsx`, `mobile/src/screens/main/DashboardScreen.tsx`.
- **Complexity:** M
- **Tests:** A communications item stored as Process counts as People after the crosswalk. A risk item counts as Business Environment. Repeating one question does not increase “tasks covered.”

### 8. Interaction types the app already has

- **Types in the bank:** `select_one` (905), `select_multiple` (10), `drag_and_match` (10). Grading already exists (`gradeQuestionResponse.ts`, `gradeSelectedAnswers.ts`).
- **Change:** Weighted selection must not drop multiple-response or usable drag items just because they are rare. Exclude unusable drag metadata (already done, lines 85–87). No new interaction type is required for launch. Hotspot and dropdown are CBT-only in the ECO and can wait.
- **Files:** `examController.ts`, `mobile/src/components/ExamAnswerPanel.tsx`, `DragAndMatch.tsx`.
- **Complexity:** S
- **Tests:** A mock draw from a fixture that contains one multiple-response and one usable drag item includes both when the quota says to prefer them. Empty drag ids `INTEGRATION-23` and `RESOURCE-3` never appear.

### 9. Labels and stale metadata in the UI

- **Files and text:**
  - `mobile/src/screens/SplashScreen.tsx` lines 122–130: “ECO Weighting” and “Aligned with PMI PMBOK® Guide & ECO.”
  - `mobile/src/screens/main/LearnScreen.tsx` line 121 and `LearningTopicsScreen.tsx` line 37: “2026 Edition.”
  - `mobile/src/data/learningTopics.ts` lines 202–229: “10 Knowledge Areas” grouped as if that were the exam domain map.
  - `README.md` line 27: 230 minutes.
  - `mobile/store-assets/screenshots/README.md`: screenshot may still show 230.
  - Progress copy that says “Business” is acceptable shorthand if the chart is labeled as not the official 26% weight until selection changes.
- **Complexity:** S for strings. M if the knowledge-area lesson is rewritten. Rewriting lesson prose is content, not a scoring fix; do it only as copy, not as a question edit.
- **Tests:** Repo search test for “230 minutes,” “ECO Weighting,” and “PMP passing score.”

### 10. Unscorable rows out of the pool

- **Ids:** `SCOPE-1`, `SCOPE-38`, `INTEGRATION-23`, `RESOURCE-3`.
- **Change:** Selector excludes these ids. If migration `009` already deactivated the two drag ids in production, the selector rule is still worth having.
- **Files:** `examController.ts`, and the question list query in `questionController.ts` if practice should hide them too.
- **Complexity:** S
- **Tests:** Those four ids are never returned for a new exam or a practice draw.

## Suggested order

| Order | Item | Launch? | Effort |
|---|---|---|---|
| 1 | Pass message and splash/Learn claims | Yes | S |
| 2 | Exclude unscorable ids and duplicate stems | Yes | S |
| 3 | Single-section disclosure on the exam card | Yes | S |
| 4 | Domain and approach quotas via the crosswalk | Yes, or drop the weighting claim | M |
| 5 | Wall-clock timer and server cap | Yes, soon after | M |
| 6 | Analytics use the same crosswalk | Follows 4 | M |
| 7 | Instructor pass on `proposed_mapping_review.tsv` | Before treating tags as final | Instructor time |
| 8 | Break state machine | After a real case section exists | L |
| 9 | Task-level coverage for P1, P6, R4, B6 | Only if the instructor cannot reassign existing items | New writing, out of scope here |

## What not to do in this pass

- Do not regenerate or paraphrase stems.
- Do not flip `is_correct` on `518741` or the drag tables without the instructor.
- Do not encode a case-study length.
- Do not add a numeric “probability of passing.”
