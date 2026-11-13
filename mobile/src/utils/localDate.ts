/**
 * Local-calendar date helpers.
 *
 * Avoid `toISOString().split('T')[0]` and `new Date('YYYY-MM-DD')` for day
 * labels / "today" checks — those use UTC and shift the weekday for users
 * outside UTC (e.g. Friday becomes Thursday or a past Saturday shows as "F").
 *
 * All streak / daily-goal day boundaries follow the device timezone
 * (whatever the user is in), not the server's UTC clock.
 */

/** IANA timezone from the device, e.g. "Europe/Berlin". */
export function getDeviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** Format a Date as YYYY-MM-DD in the device's local timezone. */
export function formatLocalDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD as a local calendar date (noon to avoid DST edge cases). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function getLocalDayOfWeek(dateStr: string): number {
  return parseLocalDate(dateStr).getDay();
}

export function isLocalToday(dateStr: string): boolean {
  return dateStr === formatLocalDate(new Date());
}

/** Last N local calendar days, oldest → newest (today last). */
export function getLocalDateRangeEndingToday(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    dates.push(formatLocalDate(date));
  }
  return dates;
}

export function localDayLabel(dayOfWeek: number): string {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayOfWeek] ?? '';
}
