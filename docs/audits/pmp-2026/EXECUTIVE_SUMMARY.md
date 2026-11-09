# PMPro PMP 2026 Alignment Audit — Executive Summary

> **Superseded in part on 9 November 2026.** The instructor who supplied the bank confirmed the questions were written for the July 2026 exam. Old ECO tags are a metadata defect, not proof the stems are outdated. The controlling reassessment is `REASSESSMENT.md`, with proposed tags in `proposed_eco_mappings.jsonl`. Technical work that does not edit question wording is in `TECHNICAL_IMPLEMENTATION_PLAN.md`. Findings below about the 61% pass line, unweighted selection, missing breaks, and unscorable rows still stand.

**Audit date:** 9 November 2026  
**Scope:** Read-only. No application code, question text, or database rows were changed.  
**Primary official sources:**

- [PMP Examination Content Outline – July 2026](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf)
- [What’s new in the updated PMP exam](https://www.pmi.org/certifications/project-management-pmp/new-exam)
- [PMP certification page](https://www.pmi.org/certifications/project-management-pmp)
- [PMI Certification Handbook](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/generic-certification-handbook.pdf) (passing-score method only)

**Content corpus examined:** every record in `questions_export_20260203_181643.json` (925 questions) and `flashcards_export_20260203_182627.json` (457 flashcards). The live production database was **not** queried in this audit. `TESTFLIGHT_STATUS.md` reports the same counts (925 / 457). `backend/database/seeds/002_pmp_questions.sql` is a small seed, not the bank.

**What was not done:** a subject-matter expert did not re-key all 925 answer choices. Structural checks covered every record. Semantic review covered every structural failure, every exact and near duplicate, every 2026-theme hit for AI and sustainability, and the task taxonomy as a whole. Answer-key correctness beyond those checks is **not claimed**.

The ECO is not the PMBOK Guide. The July 2026 ECO says there are noticeable differences between the outline and the PMBOK Guide, and that the exam is not written to any single text.

---

## Overall status

**Substantially misaligned with the July 2026 PMP exam content outline.**

The app does simulate **180 questions** and **240 minutes**. Those two facts are implemented in the mobile exam UI and constants. Almost everything that makes the 2026 exam different from the prior exam is missing or still reflects the previous outline:

- Question `domain` / `task` values are the **prior ECO** (People 14 tasks, Process 17 tasks, Business Environment 4 tasks), not the July 2026 task list (8 / 10 / 8).
- Stored domain mix matches the **old Business Environment weight of about 8%**, not 26%.
- Full mock exams are a **uniform random draw**. They do not apply 33% / 41% / 26%, and they do not apply ~40% predictive / ~60% agile and hybrid.
- There are **no exam sections, no 10-minute breaks, and no section lock**.
- There are **no case-study groups**. Multiple-response and drag-and-match exist only in very small counts. Hotspot, dropdown, and enhanced matching do not exist.
- Results tell the learner they **“Passed” at 61%** and the code comment calls that threshold the “PMP passing score.” PMI does not publish a numeric passing score.
- “2026” and “ECO weighting” appear in the Learn tab and splash screen. The question bank and exam assembler do not implement that weighting.

## Most serious gaps

1. **False pass/fail.** `passThreshold = 61` in `ExamReviewScreen` is presented as passing the PMP exam.
2. **Domain mix is the old exam.** Active export: Process 68.1%, People 22.8%, Business 8.9%. A random 180-question exam is expected to contain about **16 Business Environment items** versus about **47** if 26% of 180 were Business Environment.
3. **Task metadata cannot support a 2026 form.** PMI says each exam addresses **all tasks** in each domain. No question is tagged to a 2026 task statement. Several 2026 tasks have no dedicated coverage (common vision, continuous improvement, responsible AI). Organizational change has 7 items on the old task `3.4`.
4. **Delivery approach is not measurable against the ECO.** The only non-predictive value is the combined label `Agile / Hybrid` (455). Predictive is 50.6% of the bank versus about 40% on the exam.
5. **Two live questions have no correct answer** (`SCOPE-1`, `SCOPE-38`). `SCOPE-38` also says “choose two” but is stored as `select_one`.
6. **Product claims outrun the content.** Splash copy marks “ECO Weighting” as done and says the app is aligned with the PMBOK Guide and the ECO.

## Exam accuracy risks

A candidate who trusts a PMPro mock as a 2026 rehearsal will:

- See too much Process and far too little Business Environment.
- See predictive and a blended “agile/hybrid” bucket, not a controlled 40/60 mix across all three domains.
- Never practice a case-study section, a locked section, or a break.
- Be told they passed or failed against a number PMI does not publish.
- Receive domain analytics and review breakdowns by **PMBOK knowledge area**, not by 2026 task.

## Content quality risks

- 853 of 925 explanations do not discuss why the other options are wrong.
- Every question is `difficulty = medium`, so difficulty filters and “adaptive difficulty” cannot work.
- 5 exact duplicate stem pairs and additional near-duplicates are in the active bank.
- 24 items carry images. Several are third-party book-cover URLs on `project-management-prepcast.com`, not project charts. Provenance of numeric IDs that match a commercial simulator is a legal and quality risk. This audit does not reproduce those stems.
- Migration `009` is written to deactivate two empty drag items (`INTEGRATION-23`, `RESOURCE-3`). The February export still marks them active. Whether production has applied that migration was **not verified**.

## Recommended release blockers

Do not describe PMPro as aligned to the 2026 exam, and do not show “You Passed,” until:

1. The 61% result is relabeled as a PMPro practice benchmark, or removed.
2. Mock assembly enforces the published domain percentages within a stated tolerance, using tags that mean the 2026 domains.
3. Questions with zero correct options are removed from any exam pool.
4. Splash, Learn, store listing, and README stop stating ECO weighting or a 230-minute exam where that is not true.
5. A content owner accepts a 2026 task crosswalk and a gap-fill plan before more “2026” marketing.

Simulator breaks and case studies are major fidelity gaps. They are not, by themselves, the same defect as a false official pass score. They should block any claim of exam-day simulation.

## Top five priorities

1. Stop official-sounding pass/fail language (`mobile/src/screens/main/ExamReviewScreen.tsx`).
2. Stratify mock selection to 33/41/26 and ~40/60, or stop claiming ECO weighting.
3. Retag the bank to the July 2026 tasks and quarantine items that cannot be tagged.
4. Repair or deactivate unscorable items and exact duplicates.
5. Add a maintainable ECO version on each question so the next outline change does not repeat this drift.

## Evidence boundary

| Source | Role in this audit |
|---|---|
| `questions_export_20260203_181643.json` | Full local question corpus. Treated as the best available copy of the bank. |
| `flashcards_export_20260203_182627.json` | Full local flashcard corpus. |
| `backend/server` | Runtime API the mobile app calls (`backend/server/src/index.ts`). |
| `backend/content-service`, `backend/analytics-service`, `backend/user-service` | Parallel/legacy service trees. Not what `mobile` is wired to in this repo. |
| Live Postgres | Not queried. Counts may differ if imports or migration 009 ran after the export. |
