-- STAKE-23: explanation argues for sprint-planning invitation (order 0),
-- but is_correct was set on the stakeholder engagement matrix option (order 2).

UPDATE answers a
SET is_correct = (
  a.answer_text ILIKE 'Invite the stakeholder to attend the regularly scheduled sprint planning meetings%'
)
FROM questions q
WHERE a.question_id = q.id
  AND q.question_id = 'STAKE-23';

UPDATE questions
SET explanation = regexp_replace(
      explanation,
      '^\s*Explanation\s*:\s*',
      '',
      'i'
    ),
    updated_at = NOW()
WHERE question_id = 'STAKE-23'
  AND explanation ~* '^\s*Explanation\s*:';
