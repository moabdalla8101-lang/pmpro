/**
 * Map aliased bookmark query rows to API payload shape.
 * Kept pure so column-overwrite regressions can be unit-tested without pg.
 */
export function mapBookmarkRows(
  rows: Array<{
    bookmark_id: string;
    bookmark_user_id: string;
    bookmarked_question_id: string;
    bookmarked_at: string | Date;
    question_pk: string;
  }>,
  questions: Array<{ id: string }>
) {
  const questionById = new Map(questions.map((q) => [q.id, q]));
  return rows.map((row) => ({
    id: row.bookmark_id,
    userId: row.bookmark_user_id,
    questionId: row.bookmarked_question_id,
    createdAt: row.bookmarked_at,
    question: questionById.get(row.question_pk) || null,
  }));
}
