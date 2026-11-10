/**
 * Many bank rows already start with "Explanation:"; the UI also labels the
 * section, which produced "Explanation: Explanation:".
 */
export function formatExplanation(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/^\s*Explanation\s*:\s*/i, '').trim();
}
