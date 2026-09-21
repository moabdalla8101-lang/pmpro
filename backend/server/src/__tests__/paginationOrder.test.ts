import { clampLearnerPageSize, MAX_LEARNER_QUESTION_PAGE_SIZE } from '../serializers/questionSerializers';

/** Mirrors list ORDER BY created_at DESC, id DESC for pagination stability tests. */
export function sortQuestionsForPagination<T extends { id: string; created_at?: string; createdAt?: string }>(
  rows: T[]
): T[] {
  return [...rows].sort((a, b) => {
    const aTime = new Date(a.created_at || a.createdAt || 0).getTime();
    const bTime = new Date(b.created_at || b.createdAt || 0).getTime();
    if (bTime !== aTime) return bTime - aTime;
    return b.id.localeCompare(a.id);
  });
}

describe('pagination ordering', () => {
  it('uses id as a deterministic tie-breaker for shared created_at', () => {
    const stamp = '2024-01-01T00:00:00.000Z';
    const rows = [
      { id: 'c', created_at: stamp },
      { id: 'a', created_at: stamp },
      { id: 'b', created_at: stamp },
    ];
    const sorted = sortQuestionsForPagination(rows).map((r) => r.id);
    expect(sorted).toEqual(['c', 'b', 'a']);

    // Offset pages over the sorted list never duplicate
    const page1 = sorted.slice(0, 2);
    const page2 = sorted.slice(2, 4);
    expect(new Set([...page1, ...page2]).size).toBe(3);
  });

  it('keeps learner page size capped', () => {
    expect(clampLearnerPageSize(180)).toBe(MAX_LEARNER_QUESTION_PAGE_SIZE);
  });
});
