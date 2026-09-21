-- Deactivate unusable empty drag-and-match content and cancel incomplete
-- pre-assignment exam sessions that cannot be submitted under the new model.

UPDATE questions
SET is_active = false,
    updated_at = NOW()
WHERE question_type = 'drag_and_match'
  AND is_active = true
  AND (
    question_id IN ('INTEGRATION-23', 'RESOURCE-3')
    OR (
      (
        COALESCE(question_metadata::text, '') LIKE '%"drag_drop_pairs": []%'
        OR COALESCE(question_metadata::text, '') LIKE '%"dragDropPairs": []%'
      )
      AND NOT (COALESCE(question_metadata::text, '') LIKE '%"leftItems"%')
      AND NOT (COALESCE(question_metadata::text, '') LIKE '%"left_items"%')
    )
  );

-- Incomplete exams without a persisted assignment cannot be submitted.
UPDATE mock_exams me
SET completed_at = COALESCE(completed_at, NOW()),
    score = COALESCE(score, 0),
    correct_answers = COALESCE(correct_answers, 0)
WHERE me.completed_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM exam_questions eq WHERE eq.exam_id = me.id
  );
