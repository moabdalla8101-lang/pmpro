const IANA_TZ_RE = /^[A-Za-z0-9_+\-/]+$/;

/** Accept a client IANA timezone; fall back to UTC if missing/invalid. */
export function sanitizeTimeZone(value: unknown): string {
  if (typeof value !== 'string') return 'UTC';
  const tz = value.trim();
  if (!tz || tz.length > 64 || !IANA_TZ_RE.test(tz)) return 'UTC';
  return tz;
}

/** Accept a client local calendar day YYYY-MM-DD. */
export function sanitizeLocalDate(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const [y, m, d] = trimmed.split('-').map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (
    probe.getUTCFullYear() !== y ||
    probe.getUTCMonth() !== m - 1 ||
    probe.getUTCDate() !== d
  ) {
    return null;
  }
  return trimmed;
}

/** Whole calendar days between two YYYY-MM-DD strings (b - a). */
export function calendarDaysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const aUtc = Date.UTC(ay, am - 1, ad);
  const bUtc = Date.UTC(by, bm - 1, bd);
  return Math.round((bUtc - aUtc) / 86_400_000);
}

/** Normalize a PG DATE / timestamp to YYYY-MM-DD without server-TZ shifts. */
export function pgDateToYmd(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, '0');
    const d = String(value.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return null;
}
