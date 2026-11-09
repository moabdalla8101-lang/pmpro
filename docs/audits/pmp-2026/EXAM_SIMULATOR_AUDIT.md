# Exam Simulator Audit

Runtime path: mobile `ExamScreen` → `ExamStartScreen` → `examService` → `backend/server/src/controllers/examController.ts` (`startExam`, `submitExam`, `saveExamProgress`, `getExam`).

Legacy lookalikes that are **not** this path: `backend/analytics-service/src/controllers/examController.ts` (scores from the submitted payload length) and `backend/content-service`. The mobile app is served by `backend/server/src/index.ts`.

## A. Exam settings

| Check | Result | Evidence |
|---|---|---|
| Full mock length 180 | Implemented on the client. Server stores whatever count the client sends, if the bank can fill it. | `ExamStartScreen.tsx` lines 29–43. `startExam` lines 183–243. Integration test expects 180 (`backend/server/src/__tests__/examIntegration.test.ts` around lines 231–249) but does not assert domain mix. |
| 240 minutes | Client constant and Exam tab label. | `ExamStartScreen.tsx` line 30. `ExamScreen.tsx` lines 191–197. |
| 230 minutes | Not in the live exam constants. Still in `README.md` line 27 and called out as a stale screenshot in `mobile/store-assets/screenshots/README.md`. | Documentation drift, not the timer. |
| Countdown | `setInterval` subtracts 1 second while the screen is active. | `ExamStartScreen.tsx` lines 186–201. |
| Background / interruption | **Resume from the exam list** recomputes remaining time from `startedAt` and the duration (`computeRemainingSeconds` in `mobile/src/utils/examSubmitHelpers.ts` lines 65–73; used at `ExamStartScreen.tsx` lines 150–170). **Staying on the exam screen and backgrounding the app** does not resync to wall clock. `AppState` in `mobile/App.tsx` lines 91–103 only refreshes the subscription. A paused JavaScript timer gives the candidate extra time. | PARTIAL |
| Expiration | At 0 the client auto-submits. If the user returns via resume and remaining time is already 0, a comment says auto-submit follows the timer effect. | `ExamStartScreen.tsx` lines 152–154 and 186–193. |
| Server clock | Submit does not reject an exam that ran longer than 240 minutes. | No duration check in `submitExam`. |
| Randomization | `ORDER BY RANDOM()` with no seed stored. | `selectRandomQuestionRows` lines 76–81. |
| No repeats inside one exam | `exam_questions` has `UNIQUE (exam_id, question_id)`. Client-supplied ids must be unique. | `examController.ts` lines 35–41 and 203–208. |
| Domain weighting | **Not applied.** | Same selector. |
| Approach distribution | **Not applied.** | No `pm_approach` predicate in the selector. |
| Formats | Whatever the random draw hits: almost all single-response. Unusable drag rows are skipped, which slightly changes the draw. | Lines 85–110. |
| Mini exam | 25 questions, 15 minutes. This is a PMPro product, not a PMI format. | `ExamStartScreen.tsx` lines 31–32. |
| Practice exam cap | Server max 25 for `examType === 'practice'`. | `PRACTICE_EXAM_MAX_QUESTIONS` line 171. |
| “Prerequisites” on the Exam card | “Complete at least 100 practice questions” and “Review all knowledge areas” are **text only**. `handleStartMockExam` checks sign-in and premium, then navigates. | `ExamScreen.tsx` lines 94–102 and 208–225. |

## B. Breaks and navigation

| PMI rule | PMPro | Status |
|---|---|---|
| Two 10-minute breaks | None | NOT IMPLEMENTED |
| First break after the case-study section | No case section. PMI does not publish the item count. | NOT IMPLEMENTED. Do not hard-code a guessed index. |
| Second break about midway through independent items | No second section | NOT IMPLEMENTED |
| Review, then break, then no return | Free navigation for the whole exam, including a review grid | FAIL relative to the exam. Acceptable only if the UI calls this a single-section practice test. |
| Break time vs exam time | Not applicable until breaks exist. PMI’s 240 minutes is time to respond; the ECO describes the breaks separately. Whether break minutes are inside or outside the 240 is easy to misread. The July ECO says the time to respond to 180 questions is 240 minutes and that there are two 10-minute breaks. It also says tutorial and survey are **not** in the 240. It does not say in one sentence that break minutes are excluded. **Do not invent a 260-minute clock.** | NOT VERIFIED as a product rule |
| Saved state across interruption | Draft answers and current index are saved (`saveExamProgress`, `EXAM_DRAFT_PROGRESS_KEY`). Leave-exam dialog says progress is kept. | PARTIAL. Answers persist. Section lock does not exist to persist. Timer wall-clock is correct on the resume-by-id path only. |

Flag for review is local exam state (`flaggedQuestionIds` in `ExamStartScreen.tsx` line 56). Bookmarks sync to the account for premium users. Flags are not the same as PMI’s mark-for-review, but the behavior is present.

## C. Realism

| Experience | Status | Notes |
|---|---|---|
| Case-study groups | Missing | No schema, no UI, no shared stimulus. |
| Several questions on one project | Only if two unrelated items happen to share a topic. No group id. | |
| Charts and dashboards | Partial | Some items have images. Book-cover URLs are not exam graphics. No item type forces interpretation. |
| Drag-and-drop | Partial | 10 items. Empty metadata is skipped or deactivated by migration 009. Not enhanced matching onto a chart. |
| Multiple response | Partial | 10 items. A full exam can easily contain zero. |
| Hotspot, dropdown | Missing | ECO marks these CBT-only. Disclosing the omission is enough. Building them is optional. |
| Flag, navigator, persistence | Present | Review grid: `ExamQuestionReviewGrid`. |
| Answer persistence | Present | Draft JSON on `mock_exams.draft_answers` (ensured in `ensureExamSchema`). |
| Submit | Present | Client blocks submit while items are unanswered, unless the timer forces an incomplete payload (`buildExamSubmitPayload`). |
| Results and explanations | Present | Review screen shows score, knowledge-area bars, and per-item explanation. Domain of the **2026 ECO** is not the breakdown. Task is not shown as a study target. |
| Unproctored vs Pearson VUE | The app is a phone practice exam. It should say so. “PMP Certification Simulation” (`ExamScreen.tsx` lines 178–182) overclaims. | |

A candidate can finish a 180-question, 240-minute, single-response practice test with a flag grid and explanations. That is a useful drill. It is not a 2026 exam-day rehearsal.

## D. Scoring

| Topic | Behavior | Assessment |
|---|---|---|
| Who grades | Server. Client score fields are rejected. | Sound. `assertNoClientAuthoritativeScoreFields`. |
| Single response | Exactly one selected id must match the correct id. | Matches the item type. |
| Multiple response | Exact set. Extra, missing, or duplicate ids are wrong. No partial credit. | PMI does not publish partial credit. Document this as PMPro’s rule. |
| Drag-and-drop | Exact id-to-id map when metadata normalizes. Otherwise the grader throws rather than marking a guess correct. | Fail-closed is right. Bad metadata still means the item never appears or cannot be scored. |
| Unanswered | On timeout / partial submit, missing items are incorrect and the denominator stays the assigned count. | Sound for a practice exam. `examController.ts` lines 569–571. Test: `authoritativeScoring.integration.test.ts` “partial submit scores against assigned denominator”. |
| Inactive question after start | Scored incorrect, not dropped. | Conservative. |
| Duplicate submit | Idempotency key and unique attempt index. | Sound. |
| Domain report on the result | By knowledge-area name, prefix “Project ” stripped. | Not the 2026 domain report PMI shows (People, Process, Business Environment performance levels). |
| Pass / fail | `score >= 61` → “Congratulations! You Passed!” Comment: “PMP passing score”. | **Incorrect exam information.** Handbook: the passing score is a psychometric standard. No universal percentage is published. |
| Unscored items | All 180 affect the percentage. | Not the ECO’s 170 + 10. Acceptable if the result says “practice score, all items counted.” |

`safeExamScore` (`backend/server/src/utils/authoritativeScoring.ts`) is a bounded percentage. The defect is the label, not the arithmetic.

## E. Selection algorithm (what a mock actually is)

`selectRandomQuestionRows`:

1. Read a random slice of active questions for the certification (about 3× the request).
2. Drop drag items whose metadata is not usable.
3. Fill from a second random query if needed.
4. Truncate to the requested count.
5. Insert `exam_questions` in that order.

There is no stratification, no exposure control, no “avoid items this user saw yesterday,” and no guarantee of a single multiple-response or drag item. With 10 multiple-response items in 925, most 180-item exams will include about two, and some will include none.

Free users do not take the full mock (premium gate on the route and in `handleStartMockExam`). Free practice uses the first 10 oldest questions per knowledge area (`freeQuestionPool.ts`). That pool is stable, so free users memorize a fixed set. That is a product choice, not a 2026 defect, but it makes free-tier accuracy a poor readiness signal.

## F. Tests that exist and tests that do not

Present:

- 180-question start/submit smoke (`examIntegration.test.ts`).
- Authoritative scoring, idempotency, partial submit.
- Drag grading unit tests (`gradeQuestionResponse.test.ts`).
- Subscription gate on mock vs practice.

Absent:

- Domain quota assertion.
- Approach quota assertion.
- Break state machine.
- Wall-clock timer while backgrounded.
- “Result copy must not say the user passed the PMP.”
- Rejection of `select_one` rows with zero correct answers at exam-build time.
