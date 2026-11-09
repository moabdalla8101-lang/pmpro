import {
  classifyEcoDomain,
  domainQuotas,
  pickEco2026Questions,
  predictiveQuotas,
} from '../utils/eco2026Blueprint';

function row(
  id: string,
  domain: 'People' | 'Process' | 'Business',
  approach: 'Predictive' | 'Agile / Hybrid',
  task: string
) {
  return {
    id,
    question_id: id,
    domain,
    task,
    pm_approach: approach,
    question_text: `Stem ${id}`,
    question_type: 'select_one',
  };
}

describe('2026 mock blueprint', () => {
  it('assigns a 180-question exam to the published domain shares', () => {
    const domains = domainQuotas(180);
    expect(domains).toEqual({
      People: 59,
      Process: 74,
      BusinessEnvironment: 47,
    });
    expect(domains.People + domains.Process + domains.BusinessEnvironment).toBe(180);
  });

  it('keeps predictive items at about 40% inside those domains', () => {
    const domains = domainQuotas(180);
    const predictive = predictiveQuotas(domains, 180);
    const predictiveTotal = predictive.People + predictive.Process + predictive.BusinessEnvironment;
    expect(predictiveTotal).toBe(72);
    expect(predictive.People).toBeLessThanOrEqual(domains.People);
    expect(predictive.Process).toBeLessThanOrEqual(domains.Process);
    expect(predictive.BusinessEnvironment).toBeLessThanOrEqual(domains.BusinessEnvironment);
  });

  it('translates previous task codes onto the 2026 domain that owns the job', () => {
    expect(classifyEcoDomain({ id: 'a', task: '2.3 Assess and manage risks', domain: 'Process' })).toBe(
      'BusinessEnvironment'
    );
    expect(classifyEcoDomain({ id: 'b', task: '2.2 Manage communications', domain: 'Process' })).toBe(
      'People'
    );
    expect(classifyEcoDomain({ id: 'c', task: '2.8 Plan and manage scope', domain: 'Process' })).toBe(
      'Process'
    );
    expect(classifyEcoDomain({ id: 'd', question_id: '510489', task: '2.12 Manage project artifacts', domain: 'Process' })).toBe(
      'People'
    );
  });

  it('draws a full mock to the domain and approach quotas', () => {
    const rows: ReturnType<typeof row>[] = [];
    const tasks = {
      People: '1.2 Lead a team',
      Process: '2.8 Plan and manage scope',
      Business: '2.3 Assess and manage risks',
    };
    (['People', 'Process', 'Business'] as const).forEach((domain) => {
      for (let i = 0; i < 120; i += 1) {
        rows.push(row(`${domain}-p-${i}`, domain, 'Predictive', tasks[domain]));
        rows.push(row(`${domain}-a-${i}`, domain, 'Agile / Hybrid', tasks[domain]));
      }
    });

    const picked = pickEco2026Questions(rows, 180, () => 0.3);
    expect(picked).toHaveLength(180);
    expect(new Set(picked.map((item) => item.id)).size).toBe(180);

    const domains = { People: 0, Process: 0, BusinessEnvironment: 0 };
    let predictive = 0;
    for (const item of picked) {
      const domain = classifyEcoDomain(item);
      if (domain) domains[domain] += 1;
      if (item.pm_approach === 'Predictive') predictive += 1;
    }
    expect(domains).toEqual({
      People: 59,
      Process: 74,
      BusinessEnvironment: 47,
    });
    expect(predictive).toBe(72);
  });

  it('does not place both copies of the same stem on one exam', () => {
    const rows = [
      { ...row('a', 'People', 'Predictive', '1.2 Lead a team'), question_text: 'Same scenario' },
      { ...row('b', 'People', 'Predictive', '1.2 Lead a team'), question_text: 'Same scenario' },
      ...Array.from({ length: 30 }, (_, i) => row(`p-${i}`, 'People', 'Agile / Hybrid', '1.2 Lead a team')),
      ...Array.from({ length: 30 }, (_, i) => row(`r-${i}`, 'Process', 'Predictive', '2.8 Plan and manage scope')),
      ...Array.from({ length: 30 }, (_, i) => row(`be-${i}`, 'Business', 'Agile / Hybrid', '3.1 Plan and manage project compliance')),
    ];
    const picked = pickEco2026Questions(rows, 10, () => 0.2);
    const stems = picked.filter((item) => item.question_text === 'Same scenario');
    expect(stems.length).toBeLessThanOrEqual(1);
  });

  it('leaves unscorable question ids out', () => {
    const rows = [
      row('SCOPE-1', 'Process', 'Predictive', '2.5 Plan and manage budget and resources'),
      ...Array.from({ length: 20 }, (_, i) => row(`ok-${i}`, 'Process', 'Predictive', '2.8 Plan and manage scope')),
    ];
    const picked = pickEco2026Questions(rows, 5, () => 0.1);
    expect(picked.map((item) => item.question_id)).not.toContain('SCOPE-1');
  });
});
