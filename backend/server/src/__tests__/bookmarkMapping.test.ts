import { mapBookmarkRows } from '../utils/mapBookmarkRows';
import { clampLearnerPageSize, MAX_LEARNER_QUESTION_PAGE_SIZE } from '../serializers/questionSerializers';

describe('mapBookmarkRows', () => {
  it('preserves bookmark id, question primary id, external id, and timestamps independently', () => {
    const bookmarkId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    const questionPk = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const externalId = '22';
    const bookmarkedAt = '2026-03-01T12:00:00.000Z';

    const bookmarks = mapBookmarkRows(
      [
        {
          bookmark_id: bookmarkId,
          bookmark_user_id: 'user-1',
          bookmarked_question_id: questionPk,
          bookmarked_at: bookmarkedAt,
          question_pk: questionPk,
        },
      ],
      [{ id: questionPk, questionId: externalId } as any]
    );

    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].id).toBe(bookmarkId);
    expect(bookmarks[0].questionId).toBe(questionPk);
    expect(bookmarks[0].createdAt).toBe(bookmarkedAt);
    expect(bookmarks[0].question).toEqual(
      expect.objectContaining({ id: questionPk, questionId: externalId })
    );
    expect(bookmarks[0].id).not.toBe(questionPk);
    expect(bookmarks[0].questionId).not.toBe(externalId);
  });
});

describe('learner page size helpers', () => {
  it('caps learner pages at 50', () => {
    expect(clampLearnerPageSize(1000)).toBe(MAX_LEARNER_QUESTION_PAGE_SIZE);
    expect(MAX_LEARNER_QUESTION_PAGE_SIZE).toBe(50);
  });
});
