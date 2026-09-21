/**
 * Shared attempt-source SQL for analytics.
 * Prefer question_attempts; include legacy user_answers only when not yet backfilled.
 */
export const LEARNER_ATTEMPTS_CTE = `
  learner_attempts AS (
    SELECT
      qa.id,
      qa.user_id,
      qa.question_id,
      qa.is_correct,
      qa.selected_answer_ids,
      qa.response_json,
      qa.answered_at,
      qa.exam_id
    FROM question_attempts qa
    UNION ALL
    SELECT
      ua.id,
      ua.user_id,
      ua.question_id,
      ua.is_correct,
      ARRAY[ua.answer_id]::uuid[] AS selected_answer_ids,
      jsonb_build_object('legacyUserAnswerId', ua.id, 'legacy', true) AS response_json,
      ua.answered_at,
      NULL::uuid AS exam_id
    FROM user_answers ua
    WHERE NOT EXISTS (
      SELECT 1
      FROM question_attempts qa2
      WHERE qa2.id = ua.id
         OR (
           qa2.user_id = ua.user_id
           AND qa2.question_id = ua.question_id
           AND qa2.answered_at = ua.answered_at
           AND ua.answer_id = ANY (qa2.selected_answer_ids)
         )
    )
  )
`;
