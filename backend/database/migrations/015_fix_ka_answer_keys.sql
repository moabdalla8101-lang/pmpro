-- Fix confirmed wrong answer keys from knowledge-area HTML banks (scope/schedule).
-- Updates only answers.is_correct for three question_ids.
-- Does not rewrite stems, explanations, or unrelated rows.
-- Sibling lookalikes 519657/519653 and 517033/517042 are intentionally NOT changed here.

-- 518808: WBS multi-select is A/B/D (control account, planning package, work package).
-- Option E (scope statement: description of scope/major deliverables/exclusions) is outside the WBS.
UPDATE answers a
SET is_correct = (
  a.answer_text ILIKE 'A point where scope, budget, cost, and schedule are integrated%'
  OR a.answer_text ILIKE 'A component below the control account with known work content%'
  OR a.answer_text ILIKE 'The work defined at the lowest level for which cost and duration%'
)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = '518808';

-- 517581: burndown image hotspot — correct region is A (HTML Correct Answer + option note), not C.
UPDATE answers a
SET is_correct = (a.answer_text = 'A')
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = '517581';

-- 519880: Kanban metrics multi-select is A/C/D.
-- Option E (iteration burndown) is not appropriate when Kanban is used exclusively.
UPDATE answers a
SET is_correct = (
  a.answer_text ILIKE 'The average cycle time measured in days%'
  OR a.answer_text ILIKE 'The average time from when a user story is added to the Kanban board%'
  OR a.answer_text ILIKE 'The average response time measured in the average number of days%'
)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = '519880';

-- SCHEDULE-19: strip duplicated Explanation: prefix from explanation body only.
UPDATE questions
SET explanation = regexp_replace(explanation, '^\s*Explanation\s*:\s*', '', 'i'),
    updated_at = NOW()
WHERE question_id = 'SCHEDULE-19'
  AND explanation ~* '^\s*Explanation\s*:';
