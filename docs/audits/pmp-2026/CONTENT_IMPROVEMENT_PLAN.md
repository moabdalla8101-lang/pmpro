# Content Improvement Plan

This plan says what to correct and what to write. It does not contain replacement items, PMI sample questions, or stems from the current bank. Official PMI items are not something PMPro should clone. Commercial banks are not a source.

Nothing here is approved to author until the provenance review (action P1-5) says the existing row may be edited rather than removed.

## Questions requiring correction

### Deactivate until an SME supplies a real key

| ID | Defect |
|---|---|
| `SCOPE-1` | `select_one`, zero options marked correct, blank explanation, blank domain, task, and approach. |
| `SCOPE-38` | Stem asks for two strategies. Type is `select_one`. Zero options marked correct. Blank explanation and metadata. |
| `INTEGRATION-23` | Drag metadata is an empty pair list. Migration 009 already names this id. |
| `RESOURCE-3` | Same empty drag metadata. |

Do not guess the key for `SCOPE-38`. The stem is a multi-select and at least two options are educationally plausible. That is an authoring job.

### SME review before they stay published

| ID | Issue |
|---|---|
| `518741` | `select_multiple` with a single option marked correct. Another option (incremental delivery) is a plausible second key. |
| `520999` | Drag `matches` includes the key `(Not applicable)`, which is not a left-item label. Likely unscorable or wrongly keyed. |
| `INTEGRATION-1` | `matches` and `dragDropPairs` disagree. Grading follows `matches`. Confirm the key. |
| `Q182` | Overlaps `INTEGRATION-1` as an approach-matching item. Confirm it is a distinct scenario. |
| `22` | Drag item whose explanation is the definition of Plan Communications Management and an input list. Poor 2026 item even if the match key is internally consistent. |
| `QUALITY-4` | Only AI mention. It asks where to record experience with a categorization tool. Do not count it as AI coverage. Rewrite or replace with a decision item if the license allows editing. |
| `518538` | “How should an agile team view failure?” Recall, not judgment. |
| Exact duplicate pairs | Keep one: `519657`/`519653`, `510477`/`517014`, `512565`/`517489`, `515408`/`517021`, `517581`/`518773`. |
| Near duplicates | Human diff: `517049`/`INTEGRATION-11`, `SCHEDULE-18`/`SCHEDULE-19`, `SCHEDULE-31` against the story-point pair. |

### Image cleanup

Remove or replace book-cover images on `COMM-4`, `RESOURCE-47`, `RISK-9`, `SCHEDULE-11`, `SCHEDULE-2`, `SCHEDULE-31`, `SCHEDULE-9`, `SCOPE-37`. A cover is not a project artifact. Any remaining PrepCast URL needs a license or a locally authored graphic.

### Explanation backfill

Priority order:

1. Items that will remain in the published 2026 pool after retag.
2. Multiple-response items, because exact-set scoring is harsh without an explanation of each option.
3. The 15 items whose correct option contains always / never / only / must, checked against the Learn tab’s “eliminate absolutes” rule.
4. The nine ITTO-style explanations, rewritten as decisions unless the item is intentionally predictive-process and the explanation says why the process action is the best **next** step.

Do not bulk-rewrite 853 explanations with a model and auto-publish.

## Topics that need more original questions

Internal floor used for planning: **12 distinct scenario items** per 2026 task, and enough Business Environment items that 26% of a 180-item form can be drawn without repeating a stem. PMI does not set the floor of 12.

Write first, because the blueprint cannot be honest without them:

| Priority | 2026 home | Why |
|---|---|---|
| 1 | BE: Support organizational change | 7 old-tag items |
| 2 | BE: Continuous improvement | No task |
| 3 | BE: Evaluate external business environment changes | 15, narrow |
| 4 | BE: Governance, including ethics and escalation thresholds | 12, tagged Process today |
| 5 | People: Develop a common vision | No task |
| 6 | People: Manage stakeholder expectations, including customers | No task |
| 7 | Process: Plan and manage finance, separate from resources | Cost KA has 27; task 2.5 fuses budget and resources |
| 8 | People: Align stakeholder expectations | Only partial overlap with mentoring and shared understanding |
| 9 | Process: Value-based delivery with a benefits measure, not a slogan | Old 2.1 and 3.2 exist but are not the 2026 task |
| 10 | Process: Evaluate project status from metrics and artifacts | 2.12 is artifact-heavy |
| 11 | Cross-cutting: sustainability as a decision (compliance, quality, risk, charter), not the phrase “environmental factors” | 4 real stems |
| 12 | Cross-cutting: responsible AI decisions (bias, disclosure, human accountability, bad automation), not “where do I file the tool” | 1 weak stem |

Write second, because volume exists but the **tag and the approach mix** are wrong:

- Risk (old 2.3, 41 items) must be reviewed into BE task “Plan and manage risk,” including security and sustainability risk responses.
- Change control (old 2.10) into BE “Manage and control changes.”
- Communications (old 2.2) into People “Plan and manage communication,” and drop pure input/output matching unless a predictive scenario truly needs it.
- Stakeholder engagement (old 2.4) into People.
- Knowledge transfer (old 2.16) into People.
- Impediments (old 1.7) and issues (old 2.15) into BE “Remove impediments and manage issues.”

Do not delete the large scope, schedule, and procurement sets. They support real 2026 Process tasks. They are over-weighted only because Business Environment was never expanded when the exam weight moved from 8% to 26%. Rebalance by **adding** BE items and by blueprint quotas, not by throwing away schedule practice.

## Approach mix to aim for while writing

PMI: about 40% predictive, and the other 60% divided between adaptive/agile and hybrid, in **all three domains**, with form-to-form variation.

PMPro authoring target until PMI publishes a split of the 60%:

- Tag every new item as exactly one of predictive, agile, or hybrid.
- Keep new Business Environment items from becoming 100% predictive. The current Business slice is already 52 predictive vs 30 combined.
- Do not force a 30% agile / 30% hybrid quota and call it official.

## Flashcards requiring updates

| Action | Detail |
|---|---|
| Label current cards | “Vocabulary,” not “2026 ECO.” 106 are General/Other and cannot be mapped. |
| Add decision cards | Short scenarios for the twelve gaps above, with the task name on the back. |
| Procurement | 5 cards for 86 questions. Add vendor-performance, contract-type, and negotiation **decisions**, not only definitions. |
| Stakeholder | 13 cards for the largest People theme in the new outline. |
| Remove or rewrite | The 7 cards that cite process groups, ITTOs, or PMBOK as if that were the exam structure. Confirm each one; some predictive terms may stay if the back says when they apply. |
| Do not add | Another 50 schedule-formula cards. Schedule already has 78. |

Spaced repetition is a product feature (P3-2), not a content prerequisite.

## Missing scenario types

Author original sets. Each set is one project story and **two or more** questions. PMI does not publish how many questions sit in the case section.

Useful set themes, all original:

- A sponsor wants a market outcome; the team has a predictive contract and an unclear scope. Hybrid choice, value measure, and a change decision.
- A regulator and a community group change the external environment mid-project. Impact on backlog or scope, compliance, and stakeholder trust.
- An AI feature is proposed to rank customers or screen vendors. The decision is governance, bias, and accountability, not tool trivia.
- A sustainability constraint (materials, energy, community impact) conflicts with cost and date. Quality, risk, and benefits.
- A culture clash during an organizational change. What the project manager does with the team and the sponsor.
- A dashboard or burn chart the learner must read, then choose a next action. Graphic item, not a book cover.
- A matching item that pairs **response strategies or stakeholder actions** to a situation. Not a list of process inputs.

Item-type targets for the new writing, as PMPro choices:

- Multiple-response: enough that a 180-item form can include several without a quota that claims to be PMI’s.
- Drag-and-match: repair the broken ones before adding many more. Prefer situation-to-action over definition-to-term.
- Graphics: charts with a decision. Store files in the app’s image host.
- Hotspot and dropdown: optional, and only with a disclosure that the real CBT may include them.

## Recommended content sequence

1. Deactivate the four unscorable rows and the exact duplicate extras.
2. License decision on third-party images and numeric-id items.
3. SME retag of whatever may legally remain, using the 26 task ids. Unmapped rows leave the mock pool.
4. Write the Business Environment and empty-task scenarios until a 180-item blueprint can be filled and every task appears at least once.
5. Add multiple-response and one case set per major domain.
6. Rewrite explanations for the published pool.
7. Only then turn ECO-weighting claims back on.

## What not to do

- Do not generate 200 items in one pass and import them as active.
- Do not copy the three sample questions on the PMP certification page into the bank.
- Do not treat PMBOK 8 chapters as a quota sheet.
- Do not set a numeric “pass” equal to any unofficial percent found on blogs.
- Do not encode a case-study length as if PMI had published it.
