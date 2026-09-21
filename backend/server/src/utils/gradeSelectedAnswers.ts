/**
 * Exact-set multi-select grading used by recordAnswer.
 * Kept pure so attempt correctness can be unit-tested without a DB.
 */
export function gradeSelectedAnswers(
  selectedIds: string[],
  correctIds: string[]
): { isCorrect: boolean; uniqueSelectedIds: string[]; hasDuplicates: boolean } {
  const uniqueSelectedIds = [...new Set(selectedIds.map(String))];
  const hasDuplicates = uniqueSelectedIds.length !== selectedIds.length;
  const selectedSet = new Set(uniqueSelectedIds);
  const correctSet = new Set(correctIds.map(String));
  const isCorrect =
    !hasDuplicates &&
    uniqueSelectedIds.length === correctIds.length &&
    uniqueSelectedIds.every((id) => correctSet.has(id)) &&
    correctIds.every((id) => selectedSet.has(String(id)));

  return { isCorrect, uniqueSelectedIds, hasDuplicates };
}
