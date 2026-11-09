# July 2026 ECO Coverage Matrix

**Official structure** from the July 2026 ECO:

- Domain: high-level area. Exam percentages apply here only.
- Task: responsibility inside the domain. Every exam includes questions for every task.
- Enabler: illustrative example. Not an exhaustive list and not a weighting unit.

PMPro has **no** `eco_version`, **no** 2026 task id, and **no** enabler id. The counts below are an **auditor crosswalk** from the previous task codes stored on each question. They are not proof that a question tests that 2026 task. Flashcards have no task field at all.

**Official PMI weight:** domain percentages only.  
**Recommended internal target (not PMI):** every 2026 task should have enough distinct, scenario-based items that a 180-item form can include at least one, and that a learner can practice the task without repeating a handful of stems. A practical floor used here is **12 active, non-duplicate items per task** before the task is called covered. Tasks under that floor are gaps even when the crosswalk count is not zero. Enabler-level zeros are expected and are not, by themselves, exam defects.

Source of counts: `questions_export_20260203_181643.json`. Flashcard source: `flashcards_export_20260203_182627.json` (457 cards, knowledge area only).

## People — official 33%

Bank tag “People”: **211 (22.8%)**. Crosswalk that also pulls communications, stakeholder engagement, and knowledge transfer out of old Process: **about 299 (32.3%)**. The second number is closer to 33% only if those old Process items truly test the 2026 People tasks. Many are ITTO or communications-plan items. Treat 32% as an upper bound, not a result.

| 2026 task | Enablers (illustrative) | Nearest old tags | Question count | Flashcards | Quality | Gap |
|---|---|---|---:|---|---|---|
| 1. Develop a common vision | Shared vision, promote it, keep it current, root-cause a misunderstanding | No matching task. Partial overlap with 1.10 Build shared understanding (13) | 0 direct; ≤13 partial | No vision cards identified | Not established | **Zero dedicated coverage** |
| 2. Manage conflicts | Sources, context, resolution strategy, ground rules, violations | 1.1 (20), 1.12 (5) | 25 | General people terms only | Mixed; not re-keyed | Volume acceptable; confirm scenario vs definition |
| 3. Lead the project team | Expectations, empower, solve problems, voice of the team, diversity of skill, leadership style, roles | 1.2 (33), 1.3 (9), 1.4 (18), 1.6 (11), 1.14 (6), 1.5 (12), 1.11 (7) | ~96 if all count | Resource Management 63 cards, mostly terms | EI and virtual teams thin (6 and 7) | Partial. Do not equate “lead a team” with every resource question |
| 4. Engage stakeholders | Identify, analyze, tailor communication, execute engagement plan, align needs to objectives, trust and influence | 2.4 Engage stakeholders (46, stored as **Process**), part of 1.9 (39) | 46 on the closest tag | Stakeholder Management **13** | Domain tag is wrong for 2026 | Retag before using in a People quota |
| 5. Align stakeholder expectations | Categorize, identify expectations, facilitate alignment, mentoring | 1.13 Mentor (10), part of 1.10 (13) | No dedicated task | 13 stakeholder cards | Weak | **Insufficient** |
| 6. Manage stakeholder expectations | Internal and external customer expectations, align outcomes, monitor satisfaction | No dedicated task. Customer language is scattered | Not counted as a task | Same 13 cards | Not established | **Gap** |
| 7. Help ensure knowledge transfer | Critical knowledge, gather it, environment for transfer | 2.16 (13), stored as **Process** | 13 | Communications cards are definitions (for example “Information Radiator”) | Thin | Retag; add scenarios |
| 8. Plan and manage communication | Strategy, transparency, feedback loop, reporting, sponsor-aligned reports, governance reporting | 2.2 (40), stored as **Process** | 40 | Communications Management 23 | At least one drag item (`22`) is an ITTO matching exercise for Plan Communications Management | Volume ok; too much plan-process recall for a 2026 communications task |

People flashcards are not balanced to 33%. Stakeholder + communications cards are a small share of 457. Resource terminology is over-represented (63).

## Process — official 41%

Bank tag “Process”: **630 (68.1%)**. After the crosswalk moves risk, change control, governance, issues, communications, stakeholder engagement, and knowledge transfer to the 2026 domains that own those tasks, Process is still about **48%**. Remaining bulk is scope, schedule, procurement, quality, and methodology.

| 2026 task | Enablers (illustrative) | Nearest old tags | Question count | Flashcards | Quality | Gap |
|---|---|---|---:|---|---|---|
| 1. Develop an integrated plan and plan delivery | Needs and complexity, recommend predictive/adaptive/hybrid, critical information such as sustainability, execution strategy, integrated plan, estimates, dependencies and business value, maintain the plan, analyze data | 2.9 (23), 2.13 (63) | 86 on those tags | Integration 26 | Sustainability enabler is rare (see question audit) | Method choice is heavy; sustainability and “critical information requirements” are light |
| 2. Develop and manage project scope | Define, agreement, breakdown | 2.8 (50) plus Scope KA 90 | 50 on the task | Scope 67 | `SCOPE-1` and `SCOPE-38` are unscorable | Fix those two; otherwise one of the better-covered tasks |
| 3. Help ensure value-based delivery | Value components, prioritize by value, incremental value, examine business value, benefits measurement, delivery options | 2.1 (44), overlap with old 3.2 (39) which is stored as Business | 44 in Process; 39 more under old BE benefits | “value” appears on cards as vocabulary, not a task | Split across two old domains | Partial. Do not double-count 2.1 and 3.2 |
| 4. Plan and manage resources | Requirements, availability | Buried in 2.5 “budget **and** resources” (19) and Resource KA 99 | Cannot separate from finance | Resource 63 | Approach field does not say agile vs predictive staffing | **Metadata cannot support a resource-only quota** |
| 5. Plan and manage procurement | Plan, execute, contract types, vendor performance, negotiations, suppliers, delivery solution | 2.11 (86), Procurement KA 92 | 86 | Procurement **5** | Largest single old task | Over-weight vs a 10-task Process domain. Flashcards almost absent |
| 6. Plan and manage finance | Financial needs, contingency, spend tracking, reporting, future challenges, variances and governance, reserves | Buried in 2.5 (19), Cost KA **27** | ≤27 | Cost 34 | Formulas screens exist; scenario finance items are scarce | **Under-covered**, and fused with resources |
| 7. Plan and optimize quality | Requirements, tools, execute the plan, regulatory compliance, cost of quality **and sustainability**, reviews, continuous improvement | 2.7 (40), Quality KA 62 | 40 | Quality 15 | Sustainability enabler mostly absent | Partial |
| 8. Plan and manage schedule | Approach-based schedule, coordination, estimates including story points, benchmarks, baseline, execute, variation | 2.6 (65), Schedule KA 82 | 65 | Schedule **78** | Duplicates `519657`/`519653`/`SCHEDULE-31` | Strong, slightly heavy, contains duplicates |
| 9. Evaluate project status | Metrics, artifacts, accessibility, progress, communicate status | 2.12 artifacts (28). No status-metrics task | 28 partial | No metrics set | Several items are artifact recall | **Partial** |
| 10. Manage project closure | Stakeholder approval, close criteria, transition readiness, lessons, retrospectives, procurement and financial close | 2.17 (30) | 30 | Not a card category | Not re-keyed | Acceptable volume; still old task wording |

## Business Environment — official 26%

Stored Business: **82 (8.9%)**. Crosswalk upper bound after moving risk, change, governance, issues, and impediments: **about 176 (19%)**. Still short of 26%. The old 8% domain was compliance, benefits, external change, and organizational change only. That is why Business Environment still looks like an 8% topic.

| 2026 task | Enablers (illustrative) | Nearest old tags | Question count | Flashcards | Quality | Gap |
|---|---|---|---:|---|---|---|
| 1. Define and establish project governance | Structure, rules, ethics, policies, OPAs, success metrics, escalation paths | 2.14 (12), stored as **Process** | 12 | “governance” string appears on about 9 cards | Thin | **Insufficient** and mistagged |
| 2. Plan and manage project compliance | Security, health and safety, sustainability, regulatory; threats; consequences; measurement | 3.1 (21) | 21 | Inside General/Other | Some real compliance scenarios (`514825`, `INTEGRATION-40`) | Best current BE task; still small |
| 3. Manage and control changes | Execute change control, communicate status, implement approved changes, update documents | 2.10 (18), stored as **Process** | 18 | Change log is a Learn-topic bullet, not a card set | Predictive change control is common | Mistagged; moderate count |
| 4. Remove impediments and manage issues | Impact, priority, intervention, reassess blockers, risk becomes issue, collaborate | 1.7 (11, stored as People), 2.15 (12, stored as Process) | 23 combined | Not separated | Split across two old domains | Partial after retag |
| 5. Plan and manage risk | Identify, analyze, monitor, plan, register (example: poor IT security), execute responses including security and sustainability risk, communicate impact | 2.3 (41), Risk KA 73, stored as **Process** | 41 on the task | Risk 27 | `RISK-1` drag metadata looks usable; `520999` match table is suspect | Volume is the largest hidden BE topic. **Must be retagged** or BE quotas can never be met |
| 6. Continuous improvement | Lessons learned, keep improvement processes current, update OPAs | No task. Closest scraps: agile retrospectives inside other tasks (`518298` asks for the heart of continuous improvement) | 0 dedicated | Lessons learned mentioned in Learn topics | — | **Zero dedicated coverage** |
| 7. Support organizational change | Assess culture, evaluate impact on the project and required actions | 3.4 (7) | 7 | 0 specific | — | **Severe gap** |
| 8. Evaluate external business environment changes | Regulations, technology, geopolitical, market; impact on scope/backlog; ongoing review | 3.3 (15) | 15 | 0 specific | Includes `INTEGRATION-4` (non-sustainable sourcing) | **Thin** |

## Flashcard balance

| Knowledge area on the card | Count | 2026 relevance |
|---|---:|---|
| General/Other | 106 | Untagged. Cannot map to a domain |
| Schedule Management | 78 | Process task 8 |
| Scope Management | 67 | Process task 2 |
| Resource Management | 63 | Process task 4, definitions |
| Cost Management | 34 | Process task 6 |
| Risk Management | 27 | 2026 BE task 5, if retagged |
| Integration Management | 26 | Process task 1 |
| Communications Management | 23 | 2026 People task 8 |
| Quality Management | 15 | Process task 7 |
| Stakeholder Management | 13 | 2026 People tasks 4–6 |
| Procurement Management | 5 | Process task 5 |

No card is tagged People, Process, or Business Environment. No card is tagged predictive, agile, or hybrid. AI hits: 0. Sustainability hits: 0. Emotional intelligence hits: 1. Agile hits: 8. Cards are unique on the front face (457/457) and none have an empty back.

## Tasks with zero or insufficient meaningful coverage

**Zero dedicated questions**

- People: Develop a common vision
- People: Manage stakeholder expectations (as its own task)
- Business Environment: Continuous improvement
- Responsible-AI decisions (an emphasis, not a numbered task)

**Insufficient against the internal floor of 12 distinct scenario items**

- Align stakeholder expectations
- Knowledge transfer (13, many not confirmed as scenarios, and mistagged)
- Governance (12, mistagged)
- Organizational change (7)
- External business environment (15, barely at the floor, narrow)
- Finance as a task separate from resources
- Emotional intelligence as a People enabler/task remnant (6)
- Explicit sustainability decisions
- AI in project decisions

## Domain math the product should use

PMI target for a form, as percentages of items, with a tolerance the product must state (suggestion ±3 points, not an official PMI tolerance):

| Domain | Target | Random draw from current tags | After generous retag, still before new writing |
|---|---:|---:|---:|
| People | 33% | ~23% | ~32% upper bound |
| Process | 41% | ~68% | ~48% |
| Business Environment | 26% | ~9% | ~19% |

New items are required for Business Environment even after a correct retag. Selection code must change either way, because `selectRandomQuestionRows` does not quota anything.
