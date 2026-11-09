# Reassessment after instructor validation

**Date:** 9 November 2026  
**What changed:** The question bank was acquired from a certified PMP instructor who stated that the questions are aligned to the July 2026 exam.  
**What this is not:** That statement is supporting evidence. It is not an item-by-item proof that every key is correct, and it does not fix the app.

No question text, option, key, or explanation was edited. No application code was changed.

## How to read the three layers

| Layer | Question | Result |
|---|---|---|
| Content | Do the stems, keys, and explanations still belong on a 2026 prep product? | **Treated as current unless a structural defect says otherwise.** Instructor assurance plus stem samples support this. This audit did not re-key all 925 answers. |
| Metadata | Are domain, task, and approach stored as the July 2026 outline? | **No.** Tags are the previous task list (`1.1` … `3.4`) and `Agile / Hybrid` is one value. A proposed 2026 map is in `proposed_eco_mappings.jsonl`. |
| Application | Do the mock, score, timer, and analytics behave like the 2026 exam? | **No.** 180 questions and 240 minutes are implemented. Weighting, breaks, section lock, the 10 unscored items, and the pass message are not. |

The earlier audit treated old tags as evidence the items were old. That inference is withdrawn.

## How the proposed map was made

The July 2026 ECO has 26 tasks. The bank has 35 stored task titles from the previous outline. For each stored title, the proposal is the 2026 task that describes the same job. Stems were sampled in every stored task, including extra samples in procurement, schedule, scope, methodology, stakeholders, and value. Those samples match the job in the stored title often enough to use that translation as the default.

Keyword hits were **not** allowed to replace the default. A first pass that did that mis-filed items because words like “charter,” “lessons learned,” and “retrospective” appear inside questions whose decision is something else. Those hits are stored as `ambiguous_with` on 364 items for the instructor, not as the proposed task.

Three items were moved after the stem and the key were read:

| ID | From | Proposed | Why |
|---|---|---|---|
| `INTEGRATION-39` | Negotiate agreements | Process — integrated plan | The key is a missing charter element, not a contract. |
| `510489` | Manage artifacts | People — communication | The key is pull communication. |
| `513985` | Choose a methodology | Process — finance | The key is financing. |

`SCOPE-1` and `SCOPE-38` have no stored task and no correct option. Any task guess on them is low confidence and should be ignored until they are repaired or removed from the pool.

Full original stem, options, key, and explanation for every row are in `proposed_eco_mappings.jsonl` (925 lines). Rows that need a human are also in `proposed_mapping_review.tsv` (558 data rows).

## Revised domain distribution

Proposed primary task, all 925 rows:

| 2026 domain | Items | Share | Exam target | Gap |
|---|---:|---:|---:|---:|
| People | 283 | 30.6% | 33% | −2.4 pp |
| Process | 505 | 54.6% | 41% | +13.6 pp |
| Business Environment | 137 | 14.8% | 26% | −11.2 pp |

The raw tags were People 22.8%, Process 68.1%, Business 8.9%. Retagging is not cosmetic: communications, stakeholder engagement, and knowledge transfer move to People, and risk, change control, governance, issues, and impediments move to Business Environment. People lands close to 33%. Business Environment rises from about 9% to about 15%, and is still short of 26%. That remaining gap is a **volume** gap. It is not fixed by renaming `Business` to `Business Environment`.

A weighted draw can still build one 180-item form at 33/41/26, because 137 Business Environment items can supply about 47 seats. Those items will repeat across forms sooner than Process items will. PMI also requires every task to appear on each form. Four tasks have **no primary assignment** (see below). A form cannot cover a task that has no items.

### Proposed task counts

| Code | 2026 task | Items | Note |
|---|---|---:|---|
| P1 | Develop a common vision | 0 | 15 stems also match vision language. The 13 “shared understanding” items are proposed as P5 and flagged as possible P1. |
| P2 | Manage conflicts | 25 | Includes ground rules. |
| P3 | Lead the project team | 96 | Includes leadership, training, virtual teams, emotional intelligence, and building the team. Some staffing items may belong in R4. |
| P4 | Engage stakeholders | 85 | Old “collaborate” plus old “engage stakeholders.” |
| P5 | Align stakeholder expectations | 23 | Includes mentoring. |
| P6 | Manage stakeholder expectations | 0 | Not split out of P4. Only 2 stems tripped a customer-satisfaction phrase. Instructor should mark the customer-outcome items inside P4. |
| P7 | Help ensure knowledge transfer | 13 | |
| P8 | Plan and manage communication | 41 | |
| R1 | Integrated plan and delivery approach | 86 | Includes methodology selection. Some of these are really value or finance; they are on the review list. |
| R2 | Scope | 50 | |
| R3 | Value-based delivery | 83 | Old “deliver business value” plus old “benefits and value.” |
| R4 | Resources | 0 | The old task “budget and resources” is proposed as finance (R6). Resource leveling language appears as an alternate on 5 items. Team-acquisition items sit in P3. This is an unsplit blend, not proof the bank has no resource scenarios. |
| R5 | Procurement | 102 | Includes negotiation items. `1.8` is flagged because a few are not contracts. |
| R6 | Finance | 21 | Includes the fused budget task. |
| R7 | Quality | 40 | |
| R8 | Schedule | 65 | |
| R9 | Evaluate project status | 27 | Artifact items. Some are really communications; flagged. |
| R10 | Closure | 31 | |
| B1 | Governance | 12 | |
| B2 | Compliance | 21 | |
| B3 | Change control | 18 | |
| B4 | Impediments and issues | 23 | |
| B5 | Risk | 41 | |
| B6 | Continuous improvement | 0 | 78 items mention lessons learned, a retrospective, or similar. Many use that as a tool inside risk or team items. The instructor should pull the ones whose decision is improvement itself. |
| B7 | Organizational change | 7 | Thin, but these items exist. |
| B8 | External business environment | 15 | |

**Metadata gap:** stored domain/task strings. Fix by applying an approved map. No stem needs to change for that.

**Content gap, only after this reclassification:**

- No primary item for common vision, customer-expectation management as its own task, resources as its own task, or continuous improvement. Each may be recoverable from the review list. Until the instructor says so, a mock cannot honestly claim those tasks appear.
- Organizational change (7) and governance (12) are thin for repeated exams.
- Business Environment as a pool (137) cannot support 26% of many unique full mocks without repetition.
- Explicit responsible-AI decisions are still essentially absent (`QUALITY-4` is about where to record an AI tool). That is a content gap even if the rest of the bank is 2026-valid. It is not a launch blocker unless the marketing claims AI coverage.

**Not a content gap:** predictive schedule, scope, procurement, quality, risk, stakeholder, and value items. They are the right kind of scenario for the 2026 tasks they translate to. Sampling did not show a bank of obsolete ITTO trivia. Some explanations still teach a process name. That is a writing weakness, not a finding that the question is from a retired exam.

## Approach

Assigned from the stem and the correct answer, not from the stored `Agile / Hybrid` label alone.

| Proposed approach | Items | Share |
|---|---:|---:|
| Predictive | 480 | 51.9% |
| Agile | 315 | 34.1% |
| Hybrid | 95 | 10.3% |
| Agile or hybrid, stem does not say which | 32 | 3.5% |
| Approach-neutral | 3 | 0.3% |

Agile + hybrid is about 44%, or about 48% if the 32 unsplit items are counted with them. The ECO’s mix is about 40% predictive and 60% agile and hybrid together. PMI does not publish the agile-versus-hybrid split, and it says the exact mix varies by form.

The bank can fill a 180-item form at 40/60, because there are more than 108 agile or hybrid items. A random draw will not. That is a **selection** defect. It is not a reason to rewrite the predictive items. Thirty-two items still need the instructor to choose agile or hybrid.

Approaches appear in all three proposed domains (predictive, agile, and hybrid counts are non-zero in each).

## Answer defects, separate from tags

These are the only content defects asserted from the records themselves. They do not depend on the age of the outline. They are for the instructor, not silent edits.

**Cannot be scored**

- `SCOPE-1`, `SCOPE-38`: single-answer items with no correct option and no explanation. `SCOPE-38` also says “choose two.”
- `INTEGRATION-23`, `RESOURCE-3`: drag items with no match data. Migration `009` deactivates them if it has been applied. Not verified in production.

**Possible key problems**

- `518741`: multiple-response with one option marked correct.
- `520999`: drag map contains the key `(Not applicable)`.
- `INTEGRATION-1`, `RISK-1`: two match tables on one item. Grading uses `matches`. Confirm they agree.
- `512505`, `520138`, `RISK-7`: the correct option uses “exploit.” Check that against PMI’s ethics stance on influence. Not marked wrong.

**Duplicates (same stem, not a wrong key)**

`519657`/`519653`, `510477`/`517014`, `512565`/`517489`, `515408`/`517021`, `517581`/`518773`.

Everything else stays as the instructor keyed it.

## What the application still gets wrong

Independent of the bank:

- Results call 61% a PMP pass (`ExamReviewScreen.tsx` lines 113–114 and 158–162). PMI does not publish a percentage.
- Full mocks are a random draw (`selectRandomQuestionRows` in `examController.ts`). They do not apply 33/41/26 or 40/60.
- There are no breaks and no section lock. The July 2026 ECO places the first break after the case-study section and the second about midway through the independent items, and it does not publish those indexes. Do not invent them.
- All 180 items are scored. The ECO has 10 unscored pretest items.
- The on-screen timer does not resync to wall clock if the app is backgrounded while the screen stays open. Resume-by-id does use wall clock. The server does not enforce 240 minutes.
- Splash and Learn copy mark ECO weighting and “2026 Edition” alignment as done.

## Launch reading

Instructor validation removes “the questions are the previous exam” as a release blocker.

It does not make the current binary ready to say the user passed the PMP, or that a mock is weighted to the 2026 outline.

A responsible launch is possible **with conditions**, listed in `TECHNICAL_IMPLEMENTATION_PLAN.md`. Shipping the current pass line and the current “ECO weighting” checkpoint is still not responsible.
