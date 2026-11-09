# Official PMP 2026 Requirements Matrix

Statuses: **PASS**, **PARTIAL**, **FAIL**, **NOT IMPLEMENTED**, **NOT VERIFIED**, **NOT APPLICABLE**.

“Official” means published by PMI in the July 2026 Examination Content Outline (ECO), the PMP certification page, the “new exam” page, or the Certification Handbook. Internal study features are not official requirements.

Primary ECO examined: [July 2026 PMP ECO PDF](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf).

A fetch of the historical ECO URL (`.../pmp/pmp-examination-content-outline.pdf`) returned text footered “Examination Content Outline – revised 11 August 2026.” Domain percentages, 170/10, 240 minutes, approach mix, and question-type list match the July PDF. The July PDF is more explicit about break placement (after the case-study section, then about midway through independent items). The August footer was not byte-compared. Treat July 2026 as the source used for this audit, and re-read the PDF on file before coding section boundaries.

The ECO states that the outline is not the PMBOK Guide. PMPro must not treat “covers the PMBOK” as “covers the 2026 exam.”

---

## Exam structure

| Requirement | Official source | Current implementation | Status | Evidence | Required action |
|---|---|---|---|---|---|
| 180 questions | ECO exam-information section; PMP certification page “Exam length: 180 questions” | Full mock requests 180. Mini exam is a separate 25-question product. | PASS | `MOCK_EXAM_QUESTIONS = 180` in `mobile/src/screens/main/ExamStartScreen.tsx` lines 29–30. UI copy in `mobile/src/screens/main/ExamScreen.tsx` lines 191–192. Server accepts the client count; it does not hard-code 180 (`startExam` in `backend/server/src/controllers/examController.ts` lines 180–243). | Keep 180 for the full mock. Reject any other count when `examType` is `mock_exam`. |
| 170 scored + 10 unscored pretest, randomly placed, indistinguishable | ECO: “Of the 180 questions, 10 are considered pretest questions… All questions are randomly placed.” | Every assigned item is scored. There is no pretest flag. | NOT IMPLEMENTED | `submitExam` counts correct answers over the full assigned set (`examController.ts` around lines 569–571 and the scoring loop). | Either label the mock as “all items scored for practice,” or reserve 10 items as unscored and exclude them from the reported percentage. Do not pretend to know which real PMI items are pretest. |
| 240 minutes of exam time, not including tutorial or survey | ECO: “Allotted Exam Time 240 Minutes” for the center-based exam. Tutorial and survey are outside the 240. | Client countdown is 240 minutes for the full mock. | PARTIAL | `MOCK_EXAM_DURATION_MINUTES = 240` in `ExamStartScreen.tsx` lines 30 and 43. `README.md` line 27 still says 230 minutes. Store-asset notes still mention a 230-minute screenshot (`mobile/store-assets/screenshots/README.md`). Server submit does not check elapsed time (`examController.ts` has `started_at` but no duration enforcement). | Remove 230-minute copy. Decide whether the server should reject late submits. Do not add a fake tutorial/survey unless the product wants that ceremony. |
| Two 10-minute breaks | ECO; PMP page “Includes two 10-minute breaks” | No break state, break timer, or break UI. | NOT IMPLEMENTED | No break symbol in `ExamStartScreen.tsx`. Timer is a single countdown (lines 186–201). | Design breaks only after PMI’s section rule is implemented. Do not invent the case-study length. |
| First break after the case-study section; second about midway through independent questions | July 2026 ECO exam-information section | No sections. | NOT IMPLEMENTED | Same as above. | Mark the numeric boundary as **unpublished**. PMI does not give the case-study item count or the exact index of the second break. |
| Completed section cannot be revisited after the break starts | July 2026 ECO: “once you review your responses and start your break you will not be able to return to the questions from the previous section.” | Candidate can move to any question until submit. | FAIL | Review grid and `setCurrentQuestionIndex` in `ExamStartScreen.tsx` (navigation around lines 331–353). | Section lock is required only if PMPro claims exam-day navigation. Until then, do not claim it. |
| Online-proctored break rules may differ; ID may be rechecked | ECO points OPT candidates to a later section; handbook describes check-in and breaks generally | Not applicable to an unproctored mobile app. | NOT APPLICABLE | — | Do not copy Pearson VUE proctor rules into the app. Say the simulator is unproctored practice. |
| In-person CBT, paper in some regions, online proctor | ECO “Taking the exam” | Mobile practice app. | NOT APPLICABLE | — | No action. |
| Up to three attempts in a one-year eligibility window | ECO retake section; PMP page | Not an eligibility product. | NOT APPLICABLE | — | No action. |

## Domain and approach mix

| Requirement | Official source | Current implementation | Status | Evidence | Required action |
|---|---|---|---|---|---|
| People 33% | ECO table; new-exam page (42% → 33%); PMP page | Bank 211/925 = 22.8% tagged People. Selection is random, so a mock inherits the bank. | FAIL | Export distribution. `selectRandomQuestionRows` orders by `RANDOM()` with no domain quota (`examController.ts` lines 64–114). | Quota selection after retagging. |
| Process 41% | ECO; new-exam page (50% → 41%) | Bank 630/925 = 68.1% Process. Expected random mock ≈ 123/180. | FAIL | Same. | Same. |
| Business Environment 26% | ECO; new-exam page (8% → 26%) | Bank 82/925 = 8.9% stored as `Business`, not `Business Environment`. Expected random mock ≈ 16/180. | FAIL | Export. SQL normalizes the label to `Business` in `progressController.ts` (domain CASE around lines 688–691). | This is the clearest sign the bank was built for the previous 8% domain. |
| Domain percentages are not per-task weights | ECO: PMI adheres to percentages **at domain level**. Each exam still includes questions for **all tasks** in the domain. Enablers are illustrative, not exhaustive. | Tasks are the previous 35-task outline. No 2026 task field. | FAIL | Task inventory in `QUESTION_BANK_AUDIT.md`. Schema column is a free string (`003_add_pmp_question_fields.sql` lines 8–9). | Add `eco_version` + official task id. Do not invent per-task PMI percentages. |
| About 40% predictive; remaining 60% split between adaptive/agile and hybrid. Exact counts vary by form. Approaches appear in all three domains. | ECO “Important note” under the domain table | Predictive 468 (50.6%). Other value is the single label `Agile / Hybrid` 455 (49.2%). Agile and hybrid cannot be separated. | FAIL | Export `pm_approach` values. No approach filter in `questionService.ts` (difficulty and knowledge area only). | Split the enum. Stratify mocks. Do not publish a fake agile-vs-hybrid PMI percentage; PMI does not split the 60%. |
| Passing score is psychometric and criterion-referenced, not a published percentage. Score report is pass/fail plus domain performance. | Handbook “Establishing the Passing Score”; handbook score-report paragraph | UI uses 61% and the strings “Congratulations! You Passed!” / “Keep Practicing”. Comment says “PMP passing score”. | FAIL | `mobile/src/screens/main/ExamReviewScreen.tsx` lines 113–114 and 158–162. | Replace with a PMPro practice band. Show domain feedback without saying the candidate passed the PMP. |

## Question formats and emphasis

| Requirement | Official source | Current implementation | Status | Evidence | Required action |
|---|---|---|---|---|---|
| Multiple-choice, one correct answer (all modalities) | ECO question types | 905 `select_one`. Grader requires exactly one id. | PASS | Export type counts. `gradeQuestionResponse.ts` lines 86–88. | Keep. Repair the two `select_one` items with zero correct options. |
| Multiple-response (all modalities) | ECO | 10 `select_multiple`. Exact-set scoring, no partial credit. | PARTIAL | Export. `gradeSelectedAnswers.ts` lines 12–17. PMI does **not** publish a partial-credit rule in the ECO. | Grow the pool. Document all-or-nothing as a PMPro rule. |
| Drag-and-drop / matching (matching and enhanced matching called out as CBT-only) | ECO | 10 `drag_and_match`. Two have empty pair lists. Exam skips unusable drag metadata. | PARTIAL | `selectRandomQuestionRows` lines 85–87. Migration `009_deactivate_empty_drag_and_cancel_legacy_exams.sql` lines 3–18. | Fix metadata. Do not claim enhanced matching or hotspot. |
| Case or scenario: one situation, then a series of questions; may include charts (all modalities) | ECO “Case or Scenario (NEW)” | No case-group id, no shared stimulus, no section. | NOT IMPLEMENTED | Questions table has no case columns (`001_initial_schema.sql`, `003_add_pmp_question_fields.sql`). | New content model. Do not invent PMI’s case count. |
| Graphic interpretation (all modalities) | ECO “Graphic-Based Questions (NEW)” | 24 items have `question_images`. Many are not charts. No “interpret this graphic” type. | PARTIAL | Export image field. Static files served from `/images` (`backend/server/src/index.ts` lines 60–62). | Keep real project artifacts. Remove book-cover ads. |
| Point-and-click hotspot (CBT only) | ECO | Absent. | NOT IMPLEMENTED | No hotspot type in `authoritativeScoring.ts` allowed types (lines 6–16). | Optional. CBT-only, so a phone app can omit it if the limitation is disclosed. |
| Pull-down list (CBT only) | ECO | Absent. | NOT IMPLEMENTED | Same. | Optional, with disclosure. |
| Emphasis on AI, sustainability, stakeholder engagement, outcomes, value, business impact | New-exam page; ECO introduction cites AI and sustainability as JTA inputs; People tasks on vision, conflict, stakeholders; Process value-delivery task; Business Environment governance, compliance, change, external environment | Stakeholder language is common. Value language is common. Sustainability appears in 4 stems. One stem mentions an AI categorization tool (`QUALITY-4`) and asks where to record the experience, which is not a responsible-AI decision. Organizational change task has 7 items. | FAIL | Keyword and stem review in `QUESTION_BANK_AUDIT.md`. Learn topics mention value and hybrid judgment (`learningTopics.ts`) but also teach “10 Knowledge Areas” with a People grouping that is not the 2026 People domain (lines 202–229). | Write scenario items for the thin tasks. Do not count the word “value” as coverage. |

## Eligibility, maintenance, and trademarks

| Requirement | Official source | Current implementation | Status | Evidence | Required action |
|---|---|---|---|---|---|
| Education, experience, 35 training hours, 10-year experience window, CAPM waiver, 1 Dec 2026 live-training ATP rule | ECO eligibility; new-exam page | Not an application-for-certification product. | NOT APPLICABLE | — | Do not imply the app’s practice hours count as the 35 training hours. ECO says books and practice exams alone are not eligible commercial training. |
| 60 PDUs every 3 years | ECO CCR section; PMP page | Not a PDU tracker. | NOT APPLICABLE | — | No action. |
| PMI does not endorse third-party prep and warns against guaranteed pass claims | ECO resources / integrity section | Splash says “Pass with confidence” and “Aligned with PMI PMBOK® Guide & ECO”. A non-affiliation sentence exists. | PARTIAL | `SplashScreen.tsx` lines 91–92 and 129–130. `mobile/src/config/legal.ts` lines 9–10. | Keep the non-affiliation line visible near exam claims. Remove “aligned” until the matrix is PASS. “Pass with confidence” is marketing, not a pass guarantee; still tighten it if it sits next to a 61% “You Passed” result. |

## Unpublished or unclear (do not invent)

| Topic | What PMI published | What not to invent |
|---|---|---|
| Numeric passing score | Criterion-referenced psychometric standard. Domain-level performance on the score report. | Any universal percent, including 61%. |
| Case-study length | A section exists; the first break follows it. | Item count, number of cases, or the question index where the section ends. |
| Second break index | “Approximately midway” through independent questions. | An exact question number. |
| Split of the 60% | Divided between adaptive/agile and hybrid; form-to-form variation. | A required agile percentage separate from hybrid. |
| Per-task or per-enabler weights | All tasks appear; percentages are domain-level; enablers are examples. | A quota per enabler. |
| Partial credit on multiple-response | Not stated in the ECO. | A claim that PMI awards partial credit. |
| Whether domain % is computed on 180 or on 170 scored items | Domain table is “percentage of items on the exam.” Pretest items are randomly placed and unscored. | A false precision such as “exactly 59.4 People items.” Use a tolerance band and disclose it. |
| PMBOK 8 chapter list as the exam blueprint | ECO distinguishes itself from the PMBOK Guide. | A gap list that treats every PMBOK chapter as a required exam quota. |
