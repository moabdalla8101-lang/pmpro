-- Audit cleanup: deactivate empty SCOPE items & duplicate stems; fix misclassified drag MCQs;
-- restore PROC-42 truncated stem; trim scraped option junk from 518170 explanation.
-- Idempotent via question_id guards.

-- ========== Deactivate unanswered SCOPE panels ==========
-- SCOPE-1: empty key + empty explanation
UPDATE questions
SET is_active = false,
    updated_at = NOW()
WHERE question_id = $audit32$SCOPE-1$audit32$
  AND is_active = true;

-- SCOPE-38: empty key + empty explanation
UPDATE questions
SET is_active = false,
    updated_at = NOW()
WHERE question_id = $audit32$SCOPE-38$audit32$
  AND is_active = true;

-- ========== Fix INTEGRATION-23 / RESOURCE-3 (MCQ mis-typed as drag_and_match) ==========
-- INTEGRATION-23: convert to select_one, clear empty drag metadata, ensure key A
UPDATE questions
SET question_type = 'select_one',
    question_metadata = NULL,
    updated_at = NOW()
WHERE question_id = $audit32$INTEGRATION-23$audit32$;

UPDATE answers a
SET is_correct = (a.answer_text = $audit32$Focusing on delivering the highest-value features first$audit32$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $audit32$INTEGRATION-23$audit32$;

-- RESOURCE-3: convert to select_one, clear empty drag metadata, ensure key C
UPDATE questions
SET question_type = 'select_one',
    question_metadata = NULL,
    updated_at = NOW()
WHERE question_id = $audit32$RESOURCE-3$audit32$;

UPDATE answers a
SET is_correct = (a.answer_text = $audit32$Expose any bottlenecks by decreasing the amount of WIP$audit32$)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = $audit32$RESOURCE-3$audit32$;

-- ========== Restore PROC-42 truncated stem ==========
UPDATE questions
SET question_text = $audit32$You are managing a project for a customer with whom you have signed an Intellectual Property (IP) agreement requiring that the component design be unique. When the vendor to whom you outsourced the design makes a delivery, you are surprised to see that it is the same as one that the vendor had delivered to another of your clients. You review your contract with the vendor and realize that it does not include the uniqueness clause that would protect your customer's IP. Which of the following actions should you take to resolve this situation?$audit32$,
    updated_at = NOW()
WHERE question_id = $audit32$PROC-42$audit32$;

-- ========== Trim 518170 explanation scrape junk (was padded to 1000 chars) ==========
UPDATE questions
SET explanation = $audit32$A release burndown chart is a visual representation, which displays the amount of work left to complete the target commitment for a product release. The chart accomplishes this by displaying the actual amount of work remaining to complete the release. The concept behind the burndown chart is that the amount of remaining work will burn down as time goes by until the team gets to 100% done for the release. New user stories have been added during the sprints two to four. If the team did not complete any work during those sprints, the curve of the burndown chart that represents the actual work completed would have pointed upwards. However, since the curve is flat, one can imply the team has completed the work that has been added, but not more than that. In other words, the team was only able to keep up with the scope added during these sprints.$audit32$,
    updated_at = NOW()
WHERE question_id = $audit32$518170$audit32$;

-- ========== Deactivate exact duplicate-stem Integration clones ==========
-- Keep 510477 (longer explanation), 512565, 515408; deactivate clones.
-- deactivate 517014 (duplicate of 510477)
UPDATE questions
SET is_active = false,
    updated_at = NOW()
WHERE question_id = $audit32$517014$audit32$
  AND is_active = true;

-- deactivate 517489 (duplicate of 512565)
UPDATE questions
SET is_active = false,
    updated_at = NOW()
WHERE question_id = $audit32$517489$audit32$
  AND is_active = true;

-- deactivate 517021 (duplicate of 515408)
UPDATE questions
SET is_active = false,
    updated_at = NOW()
WHERE question_id = $audit32$517021$audit32$
  AND is_active = true;

