# Question Bank Audit

**Corpus:** `questions_export_20260203_181643.json`  
**Records read:** 925 of 925  
**Live database:** not queried  
**Seed file:** `backend/database/seeds/002_pmp_questions.sql` is not this bank

Migration `backend/database/migrations/009_deactivate_empty_drag_and_cancel_legacy_exams.sql` sets `is_active = false` for drag items `INTEGRATION-23` and `RESOURCE-3` (and any other drag row whose only metadata is an empty pair list). The export still has `is_active: true` for every row, including those two. If that migration has been applied in production, the active bank is **923**, not 925. That was **not verified**.

All figures below are the export, unless noted.

## A. Inventory

| Measure | Result |
|---|---|
| Rows | 925 |
| Distinct `id` (UUID) | 925 |
| Distinct `question_id` | 925 |
| `is_active` true | 925 |
| `is_active` false | 0 |
| Blank `domain` | 2 (`SCOPE-1`, `SCOPE-38`) |
| Blank `task` | 2 (same) |
| Blank `pm_approach` | 2 (same) |
| Difficulty | 925 `medium` |
| Newly tagged to a July 2026 task id | 0 |
| Tagged to the previous ECO task list | 923 |

### Domain (stored values)

| Stored domain | Count | Share of 925 | 2026 exam share | Difference |
|---|---:|---:|---:|---:|
| Process | 630 | 68.1% | 41% | +27.1 pp |
| People | 211 | 22.8% | 33% | −10.2 pp |
| Business | 82 | 8.9% | 26% | −17.1 pp |
| blank | 2 | 0.2% | — | — |

`Business` is the old short label. Nothing is stored as `Business Environment`. The 8.9% share is the previous exam’s Business Environment weight, not the 2026 weight.

Expected composition of a **random** 180-item mock (export proportions):

| Domain | Expected count | 26/33/41% of 180 (illustrative, not an official item count) |
|---|---:|---:|
| People | 41 | 59 |
| Process | 123 | 74 |
| Business Environment | 16 | 47 |

PMI publishes percentages, not “exactly 59 / 74 / 47,” and does not say whether the 10 pretest items sit inside those percentages. The gap is large enough that the distinction does not rescue the bank: 16 versus about 47 is not a rounding issue.

### Delivery approach

| Stored `pm_approach` | Count | Share | ECO |
|---|---:|---:|---|
| Predictive | 468 | 50.6% | about 40% |
| Agile / Hybrid | 455 | 49.2% | the other 60% is **split** between adaptive/agile and hybrid; this field does not split them |
| blank | 2 | 0.2% | — |

Domain × approach (active export):

| Domain | Predictive | Agile / Hybrid |
|---|---:|---:|
| People | 95 | 116 |
| Process | 321 | 309 |
| Business | 52 | 30 |
| blank | 0 | 0 (both fields blank on 2 rows) |

Approaches do appear in every stored domain. Business is more predictive (52 vs 30). Because agile and hybrid share one label, “hybrid appears in all domains” is **not verified**.

### Knowledge area (PMBOK-style, not 2026 domains)

| Knowledge area | Count |
|---|---:|
| Project Integration Management | 243 |
| Project Resource Management | 99 |
| Project Stakeholder Management | 99 |
| Project Procurement Management | 92 |
| Project Scope Management | 90 |
| Project Schedule Management | 82 |
| Project Risk Management | 73 |
| Project Quality Management | 62 |
| Project Communications Management | 58 |
| Project Cost Management | 27 |

Cost is thin relative to procurement, schedule, and integration. There is no knowledge area for AI, sustainability, benefits realization, or organizational change. Those topics only exist if a question happens to mention them inside an old knowledge area.

### Format and difficulty

| `question_type` | Count |
|---|---:|
| `select_one` | 905 |
| `drag_and_match` | 10 |
| `select_multiple` | 10 |

Correct-option counts:

| Type | Correct options on the row | Count |
|---|---|---:|
| select_one | 1 | 903 |
| select_one | 0 | 2 |
| select_multiple | 4 | 4 |
| select_multiple | 3 | 5 |
| select_multiple | 1 | 1 |
| drag_and_match | 0 (key is in metadata, not `answers.is_correct`) | 8 |
| drag_and_match | 1 | 2 |

Answer-choice counts: 905 with 4 options, 13 with 5, 5 with 6, 2 with 7.

Difficulty cannot be audited. The column does not vary.

### Previous-ECO task counts (this is what the data actually contains)

These titles match the pre-2026 ECO, not the July 2026 task statements.

**People-style codes**

| Task | Count |
|---|---:|
| 1.1 Manage conflict | 20 |
| 1.2 Lead a team | 33 |
| 1.3 Support team performance | 9 |
| 1.4 Empower team members and stakeholders | 18 |
| 1.5 Ensure team members/stakeholders are adequately trained | 12 |
| 1.6 Build a team | 11 |
| 1.7 Address and remove impediments, obstacles, and blockers for the team | 11 |
| 1.8 Negotiate project agreements | 17 |
| 1.9 Collaborate with stakeholders | 39 |
| 1.10 Build shared understanding | 13 |
| 1.11 Engage and support virtual teams | 7 |
| 1.12 Define team ground rules | 5 |
| 1.13 Mentor relevant stakeholders | 10 |
| 1.14 Promote team performance through the application of emotional intelligence | 6 |

**Process-style codes**

| Task | Count |
|---|---:|
| 2.1 Execute project with the urgency required to deliver business value | 44 |
| 2.2 Manage communications | 40 |
| 2.3 Assess and manage risks | 41 |
| 2.4 Engage stakeholders | 46 |
| 2.5 Plan and manage budget and resources | 19 |
| 2.6 Plan and manage schedule | 65 |
| 2.7 Plan and manage quality of products/deliverables | 40 |
| 2.8 Plan and manage scope | 50 |
| 2.9 Integrate project planning activities | 23 |
| 2.10 Manage project changes | 18 |
| 2.11 Plan and manage procurement | 86 |
| 2.12 Manage project artifacts | 28 |
| 2.13 Determine appropriate project methodology/methods and practices | 63 |
| 2.14 Establish project governance structure | 12 |
| 2.15 Manage project issues | 12 |
| 2.16 Ensure knowledge transfer for project continuity | 13 |
| 2.17 Plan and manage project/phase closure or transitions | 30 |

**Business-style codes**

| Task | Count |
|---|---:|
| 3.1 Plan and manage project compliance | 21 |
| 3.2 Evaluate and deliver project benefits and value | 39 |
| 3.3 Evaluate and address external business environment changes for impact on scope | 15 |
| 3.4 Support organizational change | 7 |

Procurement (86), schedule (65), and methodology selection (63) dominate. Organizational change (7), ground rules (5), emotional intelligence (6), and virtual teams (7) are thin even on the old outline.

## B. Domain alignment

See the table in section A. Business Environment is underrepresented **because the bank still matches the old 8% weight**. Relabeling `Business` to `Business Environment` does not add items.

An auditor crosswalk that moves old tasks onto the 2026 domain that best fits the task statement (risk, change, governance, and issues into Business Environment; communications, stakeholder engagement, and knowledge transfer into People) still leaves Business Environment near **19%** and Process near **48%**. The shortfall is volume, not only labels. That crosswalk is in `ECO_COVERAGE_MATRIX.md`. It is not a PMI mapping.

## C. 2026 task coverage

No row contains a July 2026 task name such as “Develop a common vision” or “Help ensure value-based delivery.” Coverage is therefore **not proven** by the domain column. See the matrix document for the crosswalk and the zero-coverage tasks.

## D. Project delivery approaches

Fail against “about 40% predictive and 60% agile/adaptive plus hybrid.”

- Predictive is about 11 percentage points high.
- The non-predictive half is one bucket, so the 60% split cannot be checked.
- A random 180-item exam would contain about 91 predictive items versus about 72 if 40% of 180 were predictive.

## E. 2026 emphasis (application, not keyword counts)

Keyword hits were computed on stem + explanation, then checked. They are not coverage.

| Theme | What the bank actually supports | Judgment |
|---|---|---|
| Artificial intelligence | 1 stem, `QUALITY-4`. The situation is an AI tool that categorizes complaints. The question asks where to record the experience with the tool. | Not a test of responsible AI decisions. |
| Responsible AI, bias, AI governance | 0 | Missing. |
| Sustainability / environmental impact | 4 stems use sustainability, biodegradable packaging, non-sustainable sourcing, or an environmental lobbying constraint (`515737`, `INTEGRATION-4`, `514293`, `STAKE-36`). Other “environmental” hits are enterprise environmental factors, not sustainability. | A handful of scenarios. Not a theme. |
| Business value and benefits | Old tasks 2.1 (44) and 3.2 (39) exist. Many explanations still talk about process outputs. | Partial. Needs SME review before calling it 2026 value-delivery. |
| Organizational strategy | No strategy task. Word “strateg” appears in 78 records, mostly incidental. | Not established. |
| Governance and compliance | 2.14 governance = 12. 3.1 compliance = 21. | Thin for a 26% domain. |
| Stakeholder engagement | Large old-task counts (1.9 and 2.4). | Volume exists. Domain tag is often Process, which is wrong for 2026 People task 4. |
| Customer expectations | No 2026 “manage stakeholder expectations” task tag. “Customer” appears often inside other tasks. | Not mapped. |
| Organizational change | 7 items on 3.4. | Insufficient. |
| Risk-based decisions | 41 items on old 2.3, plus risk knowledge area 73. | Volume exists on the **old Process** task. In 2026, “Plan and manage risk” is a Business Environment task. |
| Leadership and emotional intelligence | 1.2 is 33. Explicit EI task 1.14 is 6. | Leadership volume is moderate. EI is thin. |
| Adaptive planning | 2.13 is 63, but the approach field cannot separate agile from hybrid. | Partial. |
| Outcomes and value delivery | See benefits row. | Partial, and mixed with ITTO-style explanations. |

## F. Quality findings

### Structural (every record)

| Check | Count | IDs |
|---|---:|---|
| `select_one` with zero correct answers | 2 | `SCOPE-1`, `SCOPE-38` |
| Missing explanation | 2 | same |
| Stem says choose two, type is `select_one`, zero correct | 1 | `SCOPE-38` |
| `select_multiple` with only one option marked correct | 1 | `518741` |
| Exact duplicate stems | 5 pairs (10 rows) | see below |
| Near-duplicate (token Jaccard ≥ 0.82) | 9 pairs, including the exact pairs | see below |
| Explanation mentions why other options are wrong | 72 | — |
| Explanation does not | 853 | — |
| Explanation under 120 characters | 4 | includes the two blanks |
| Stem under 80 characters | 10 | listed below |
| `all of the above` / `none of the above` | 0 | — |
| Drag metadata with empty `drag_drop_pairs` and no item lists | 2 | `INTEGRATION-23`, `RESOURCE-3` |
| Drag match key that is not a left-item label | 1 | `520999` includes the key `(Not applicable)` |

`518741` is a judgment call, not a proven wrong key. The stem asks what the project manager could do so the customer sees results more often. Only “a cadence with regular timeboxes” is marked correct. Incremental delivery is one of the other options and is a plausible second key. **Needs an SME.** Do not auto-rewrite it.

Short stems (length under 80 characters). Several are still situational; they are weak as 2026 case practice:

`515065`, `517714`, `515733`, `PROC-2`, `518298`, `518538`, `518594`, `518630`, `SCOPE-13`, `511413`.

`518538` (“How should an agile team view failure?”) is definitional recall.

### Exact duplicate stems

| IDs | Note |
|---|---|
| `519657`, `519653` | Same iteration / story-point stem |
| `510477`, `517014` | Same cellular-tower stem |
| `512565`, `517489` | Same intangible-benefits stem |
| `515408`, `517021` | Same progressive-elaboration stem |
| `517581`, `518773` | Same retrospective stem |

Near duplicates beyond those pairs:

| IDs | Similarity |
|---|---|
| `517049`, `INTEGRATION-11` | 0.96 |
| `SCHEDULE-18`, `SCHEDULE-19` | 0.86 |
| `519657` / `519653`, `SCHEDULE-31` | 0.84 |

`INTEGRATION-1` and `Q182` are both drag-and-match approach-selection items. Stems differ. Treat as overlap, not a proven duplicate. `INTEGRATION-1` also carries `dragDropPairs` that do not tell the same story as `matches`. Grading uses `matches` first (`normalizeDragMetadata.ts` lines 128–161). An SME should confirm the key.

### Images

24 questions have `question_images`. About 20 referenced chart filenames resolve to files under `images/exam_sim_questions/` (21 files in that folder at audit time). These question IDs point at **book-cover** assets on `project-management-prepcast.com`, not at a project graphic:

`COMM-4`, `RESOURCE-47`, `RISK-9`, `SCHEDULE-11`, `SCHEDULE-2`, `SCHEDULE-31`, `SCHEDULE-9`, `SCOPE-37`.

`INTEGRATION-32`, `RISK-16`, `SCHEDULE-18`, `SCHEDULE-19` also reference that host (charts and/or covers). External URLs were not downloaded. Several local filenames in git status (`6113148.jpg`, `6113191.jpg`, `6113194.jpg`, `614008-A/B/C`, `650813a/b`) are untracked copies; whether every production URL resolves was **not verified**.

Numeric `question_id` values and PrepCast image paths are a **provenance risk**. This audit does not copy stems. Before any 2026 authoring program, confirm the bank’s license. Unlicensed commercial items should leave the product regardless of domain fit.

### Explanations and outdated framing

Nine explanations read as process-definition or ITTO recall (inputs/tools/outputs or “is the definition of”). Thirty-eight stems or explanations mention PMBOK, a process group, ITTOs, or a named process such as Develop Project Charter or Perform Integrated Change Control. That is not automatically wrong — some predictive items should use those ideas — but it is a poor fit as the dominant explanation style for a judgment exam.

Fifteen items mark a correct option that contains always / never / only / must. The Learn tab tells candidates to eliminate absolutes (`learningTopics.ts` around lines 500–504). Those keys should be SME-checked for a contradiction.

### What this audit will not claim

- That the other 903 single-answer keys are correct.
- That duplicate pairs have the same key (they share a stem; options were not fully diffed for every pair).
- That production Postgres matches the export after later imports.

## Source-of-truth note

Runtime reads `questions` in Postgres via `backend/server`. The export is the only complete snapshot in the repo. Import scripts under `scripts/import-*-questions.js` point at JSON files on a developer machine (`/Users/mohamed/Downloads/...`) that are **not** in this repository. Those scripts normalize domain strings such as `3. Business Environment` to `Business` (`scripts/import-scope-questions.js` and the sibling importers). That normalization explains the stored label.
