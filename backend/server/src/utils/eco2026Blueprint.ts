/**
 * Builds a full mock to the July 2026 PMP mix.
 *
 * Domain shares are the published exam weights: People 33%, Process 41%,
 * Business Environment 26%. About 40% of items are predictive. The other 60%
 * are agile and hybrid together. PMI does not publish how that 60% splits,
 * and this bank stores those two approaches as one value.
 *
 * Stored task titles are the previous outline. They are translated here into
 * the 2026 domain that owns the same job. Question wording is not changed.
 */

export type EcoDomain = 'People' | 'Process' | 'BusinessEnvironment';
export type EcoApproach = 'predictive' | 'agileHybrid';

export const ECO_2026_DOMAIN_POINTS: Record<EcoDomain, number> = {
  People: 33,
  Process: 41,
  BusinessEnvironment: 26,
};

export const ECO_2026_PREDICTIVE_POINTS = 40;

const TASK_CODE_DOMAIN: Record<string, EcoDomain> = {
  '1.1': 'People',
  '1.2': 'People',
  '1.3': 'People',
  '1.4': 'People',
  '1.5': 'People',
  '1.6': 'People',
  '1.9': 'People',
  '1.10': 'People',
  '1.11': 'People',
  '1.12': 'People',
  '1.13': 'People',
  '1.14': 'People',
  '2.2': 'People',
  '2.16': 'People',

  '1.8': 'Process',
  '2.1': 'Process',
  '2.5': 'Process',
  '2.6': 'Process',
  '2.7': 'Process',
  '2.8': 'Process',
  '2.9': 'Process',
  '2.11': 'Process',
  '2.12': 'Process',
  '2.13': 'Process',
  '2.17': 'Process',
  '3.2': 'Process',

  '1.7': 'BusinessEnvironment',
  '2.3': 'BusinessEnvironment',
  '2.10': 'BusinessEnvironment',
  '2.14': 'BusinessEnvironment',
  '2.15': 'BusinessEnvironment',
  '3.1': 'BusinessEnvironment',
  '3.3': 'BusinessEnvironment',
  '3.4': 'BusinessEnvironment',
};

/** Items whose stored task does not match the decision in the stem. */
const QUESTION_DOMAIN_OVERRIDE: Record<string, EcoDomain> = {
  '510489': 'People',
};

/** Rows that cannot be scored. Kept out of new mocks. */
const UNSCORABLE_QUESTION_IDS = new Set([
  'SCOPE-1',
  'SCOPE-38',
  'INTEGRATION-23',
  'RESOURCE-3',
]);

export type BlueprintCandidate = {
  id: string;
  question_id?: string | null;
  domain?: string | null;
  task?: string | null;
  pm_approach?: string | null;
  question_text?: string | null;
  question_type?: string | null;
};

export function allocateByPoints(
  points: Array<{ key: string; points: number }>,
  total: number
): Record<string, number> {
  const pointSum = points.reduce((sum, item) => sum + item.points, 0);
  const rows = points.map((item) => {
    const exact = pointSum === 0 ? 0 : (total * item.points) / pointSum;
    return {
      key: item.key,
      count: Math.floor(exact),
      frac: exact - Math.floor(exact),
      exact,
    };
  });
  let used = rows.reduce((sum, row) => sum + row.count, 0);
  const order = [...rows].sort((a, b) => b.frac - a.frac || b.exact - a.exact);
  let cursor = 0;
  while (used < total && order.length > 0) {
    order[cursor % order.length].count += 1;
    used += 1;
    cursor += 1;
    if (cursor > total + order.length) break;
  }
  return Object.fromEntries(rows.map((row) => [row.key, row.count]));
}

export function domainQuotas(total: number): Record<EcoDomain, number> {
  const allocated = allocateByPoints(
    (Object.keys(ECO_2026_DOMAIN_POINTS) as EcoDomain[]).map((key) => ({
      key,
      points: ECO_2026_DOMAIN_POINTS[key],
    })),
    total
  );
  return {
    People: allocated.People || 0,
    Process: allocated.Process || 0,
    BusinessEnvironment: allocated.BusinessEnvironment || 0,
  };
}

export function predictiveQuotas(
  domains: Record<EcoDomain, number>,
  total: number
): Record<EcoDomain, number> {
  const target = Math.round((total * ECO_2026_PREDICTIVE_POINTS) / 100);
  const rows = (Object.keys(domains) as EcoDomain[]).map((domain) => {
    const exact = domains[domain] * (ECO_2026_PREDICTIVE_POINTS / 100);
    return {
      domain,
      count: Math.min(domains[domain], Math.floor(exact)),
      frac: exact - Math.floor(exact),
      cap: domains[domain],
    };
  });
  let used = rows.reduce((sum, row) => sum + row.count, 0);
  const order = [...rows].sort((a, b) => b.frac - a.frac || b.cap - a.cap);
  let guard = 0;
  while (used < target && guard < target + order.length * 2) {
    const row = order[guard % Math.max(order.length, 1)];
    guard += 1;
    if (!row || row.count >= row.cap) continue;
    row.count += 1;
    used += 1;
  }
  return {
    People: rows.find((row) => row.domain === 'People')?.count || 0,
    Process: rows.find((row) => row.domain === 'Process')?.count || 0,
    BusinessEnvironment: rows.find((row) => row.domain === 'BusinessEnvironment')?.count || 0,
  };
}

export function taskCode(task: string | null | undefined): string | null {
  const match = String(task || '').trim().match(/^(\d+\.\d+)/);
  return match ? match[1] : null;
}

export function classifyEcoDomain(row: BlueprintCandidate): EcoDomain | null {
  const override = row.question_id ? QUESTION_DOMAIN_OVERRIDE[row.question_id] : undefined;
  if (override) return override;
  const code = taskCode(row.task);
  if (code && TASK_CODE_DOMAIN[code]) return TASK_CODE_DOMAIN[code];
  const stored = String(row.domain || '')
    .replace(/^\d+\.\s*/, '')
    .trim()
    .toLowerCase();
  if (stored.startsWith('people')) return 'People';
  if (stored.startsWith('process')) return 'Process';
  if (stored.startsWith('business')) return 'BusinessEnvironment';
  return null;
}

export function classifyEcoApproach(row: BlueprintCandidate): EcoApproach | null {
  const value = String(row.pm_approach || '').toLowerCase();
  if (value.includes('predict')) return 'predictive';
  if (value.includes('agile') || value.includes('hybrid') || value.includes('adaptive')) {
    return 'agileHybrid';
  }
  return null;
}

export function normalizeStem(text: string | null | undefined): string {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function isScorableCandidate(row: BlueprintCandidate): boolean {
  if (row.question_id && UNSCORABLE_QUESTION_IDS.has(row.question_id)) return false;
  return true;
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function take<T extends { id: string }>(
  list: T[] | undefined,
  count: number,
  pickedIds: Set<string>
): T[] {
  const chosen: T[] = [];
  if (!list || count <= 0) return chosen;
  while (chosen.length < count && list.length > 0) {
    const row = list.shift()!;
    if (pickedIds.has(row.id)) continue;
    pickedIds.add(row.id);
    chosen.push(row);
  }
  return chosen;
}

/**
 * Pick `total` questions. Domain quotas are filled first. Inside each domain,
 * about 40% are predictive. If a cell is short, the same domain fills it.
 * Any seats still open are filled from whatever usable questions remain so a
 * small bank can still start an exam.
 */
export function pickEco2026Questions<T extends BlueprintCandidate>(
  rows: T[],
  total: number,
  rng: () => number = Math.random
): T[] {
  if (total <= 0) return [];
  const domains = domainQuotas(total);
  const predictive = predictiveQuotas(domains, total);
  const buckets = new Map<string, T[]>();
  const filler: T[] = [];
  const seenStems = new Set<string>();

  for (const row of shuffle(rows.filter(isScorableCandidate), rng)) {
    const stem = normalizeStem(row.question_text);
    if (stem && seenStems.has(stem)) continue;
    if (stem) seenStems.add(stem);
    const domain = classifyEcoDomain(row);
    const approach = classifyEcoApproach(row);
    if (!domain || !approach) {
      filler.push(row);
      continue;
    }
    const key = `${domain}:${approach}`;
    const list = buckets.get(key) || [];
    list.push(row);
    buckets.set(key, list);
  }

  const picked: T[] = [];
  const pickedIds = new Set<string>();
  const domainOrder: EcoDomain[] = ['People', 'Process', 'BusinessEnvironment'];

  for (const domain of domainOrder) {
    const predNeed = predictive[domain] || 0;
    const agileNeed = Math.max(0, (domains[domain] || 0) - predNeed);
    const predBucket = buckets.get(`${domain}:predictive`);
    const agileBucket = buckets.get(`${domain}:agileHybrid`);
    const gotPred = take(predBucket, predNeed, pickedIds);
    const gotAgile = take(agileBucket, agileNeed, pickedIds);
    if (gotPred.length < predNeed) {
      gotPred.push(...take(agileBucket, predNeed - gotPred.length, pickedIds));
    }
    if (gotAgile.length < agileNeed) {
      gotAgile.push(...take(predBucket, agileNeed - gotAgile.length, pickedIds));
    }
    picked.push(...gotPred, ...gotAgile);
  }

  if (picked.length < total) {
    const rest: T[] = [];
    for (const list of buckets.values()) rest.push(...list);
    rest.push(...filler);
    picked.push(...take(rest, total - picked.length, pickedIds));
  }

  return shuffle(picked, rng).slice(0, total);
}
