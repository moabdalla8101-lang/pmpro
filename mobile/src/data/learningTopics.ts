/**
 * Structured PMP learning topics for the Learn tab.
 * Content distilled from common PMP exam study frameworks (2026-oriented).
 */

export type LearningCategory =
  | 'mindset'
  | 'methods'
  | 'formulas'
  | 'risk'
  | 'people'
  | 'process'
  | 'exam';

export interface LearningSection {
  title: string;
  body?: string;
  bullets?: string[];
  tip?: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  subtitle: string;
  category: LearningCategory;
  icon: string;
  color: string;
  sections: LearningSection[];
}

export const LEARNING_CATEGORIES: {
  id: LearningCategory | 'all';
  label: string;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'methods', label: 'Methods' },
  { id: 'process', label: 'Process' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'risk', label: 'Risk' },
  { id: 'people', label: 'People' },
  { id: 'exam', label: 'Exam Tips' },
];

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'pmp-mindset-pillars',
    title: 'PMP Mindset Pillars',
    subtitle: 'Think · Collaborate · Deliver Value · Adapt',
    category: 'mindset',
    icon: 'brain',
    color: '#1a237e',
    sections: [
      {
        title: 'How to think on the exam',
        body: 'The PMP exam rewards judgment: analyze, collaborate, and deliver value—not memorization alone.',
      },
      {
        title: 'Think',
        bullets: [
          'Understand the issue before acting',
          'Analyze root cause and impacts',
          'Make informed, data-driven decisions',
        ],
      },
      {
        title: 'Collaborate',
        bullets: [
          'Engage stakeholders early and often',
          'Communicate clearly and transparently',
          'Build consensus with the team',
        ],
      },
      {
        title: 'Deliver value',
        bullets: [
          'Align work with business goals',
          'Create value in every increment',
          'Measure outcomes, not just outputs',
        ],
      },
      {
        title: 'Adapt',
        bullets: [
          'Iterate and inspect frequently',
          'Welcome change when it improves outcomes',
          'Improve continuously (retrospectives, lessons learned)',
        ],
        tip: 'Project documents are living documents—keep them current.',
      },
    ],
  },
  {
    id: 'process-groups',
    title: 'Process Groups',
    subtitle: 'Organize work from start to finish',
    category: 'process',
    icon: 'sitemap',
    color: '#1565c0',
    sections: [
      {
        title: 'The five process groups',
        bullets: [
          'Initiating — define and authorize the project',
          'Planning — plan the work to achieve goals',
          'Executing — complete the work to produce outputs',
          'Monitoring & Controlling — track performance and correct course',
          'Closing — finalize activities and formally close',
        ],
      },
      {
        title: 'Key facts',
        bullets: [
          'Process groups organize work; they are NOT project phases',
          'Monitoring & Controlling spans the entire lifecycle',
          'Planning and M&C show up often in situational questions',
          'Groups interact and overlap throughout the project',
        ],
        tip: 'Apply process groups in predictive, agile, and hybrid contexts.',
      },
    ],
  },
  {
    id: 'evm-formulas',
    title: 'EVM Formulas',
    subtitle: 'Cost and schedule performance at a glance',
    category: 'formulas',
    icon: 'chart-line',
    color: '#2e7d32',
    sections: [
      {
        title: 'Core terms',
        bullets: [
          'EV — Earned Value (work performed)',
          'PV — Planned Value (work planned)',
          'AC — Actual Cost (cost incurred)',
          'BAC — Budget at Completion (total budget)',
        ],
      },
      {
        title: 'Cost performance',
        bullets: [
          'CPI = EV ÷ AC (>1 under budget, <1 over budget)',
          'CV = EV − AC (>0 under budget, <0 over budget)',
        ],
      },
      {
        title: 'Schedule performance',
        bullets: [
          'SPI = EV ÷ PV (>1 ahead, <1 behind)',
          'SV = EV − PV (>0 ahead, <0 behind)',
        ],
      },
      {
        title: 'Forecasting',
        bullets: [
          'EAC = BAC ÷ CPI (when current CPI continues)',
          'ETC = EAC − AC (remaining cost to finish)',
          'VAC = BAC − EAC (>0 expected under budget)',
        ],
        tip: 'EV in the numerator is “good news.” Rising AC in the denominator hurts CPI.',
      },
    ],
  },
  {
    id: 'agile-vs-predictive',
    title: 'Agile vs Predictive vs Hybrid',
    subtitle: 'Choose the approach that fits the context',
    category: 'methods',
    icon: 'swap-horizontal',
    color: '#00838f',
    sections: [
      {
        title: 'Agile',
        body: 'Adaptive and iterative delivery.',
        bullets: [
          'Incremental delivery and frequent feedback',
          'Welcomes change; backlog-driven',
          'Just-enough documentation',
          'Best when requirements are unclear or change often',
        ],
      },
      {
        title: 'Predictive',
        body: 'Plan-driven sequential delivery.',
        bullets: [
          'Detailed upfront planning; scope fixed early',
          'Changes controlled formally',
          'Comprehensive documentation',
          'Best when scope and technology are stable',
        ],
      },
      {
        title: 'Hybrid',
        body: 'Combine predictive structure with agile flexibility based on need.',
        tip: 'Exam scenarios often use hybrid—pick the approach that maximizes value.',
      },
    ],
  },
  {
    id: 'knowledge-areas',
    title: '10 Knowledge Areas',
    subtitle: 'Core disciplines that drive success',
    category: 'process',
    icon: 'view-grid',
    color: '#6a1b9a',
    sections: [
      {
        title: 'The ten areas',
        bullets: [
          'Integration — coordination across the project',
          'Scope — requirements and boundaries',
          'Schedule — timeline',
          'Cost — budget',
          'Quality — standards and fitness for use',
          'Resource — team and physical resources',
          'Communications — information flow',
          'Risk — uncertainty',
          'Procurement — vendors and contracts',
          'Stakeholder — engagement',
        ],
      },
      {
        title: 'Memory groupings',
        bullets: [
          'Triple constraint: Scope, Schedule, Cost',
          'People: Resource, Communications, Stakeholder',
          'Governance/support: Integration, Quality, Risk, Procurement',
        ],
        tip: 'Integration coordinates work across all knowledge areas. A change in one often affects others.',
      },
    ],
  },
  {
    id: 'comm-channels-pert',
    title: 'Channels & PERT',
    subtitle: 'Communication complexity and three-point estimates',
    category: 'formulas',
    icon: 'calculator-variant',
    color: '#ef6c00',
    sections: [
      {
        title: 'Communication channels',
        bullets: [
          'Formula: n(n − 1) ÷ 2',
          'Example: 5 people → 5×4÷2 = 10 channels',
          'Adding people grows channels exponentially',
        ],
      },
      {
        title: 'PERT three-point estimate',
        bullets: [
          'Estimate = (O + 4M + P) ÷ 6',
          'σ = (P − O) ÷ 6',
          'Variance = [(P − O) ÷ 6]²',
          'Most Likely (M) has the highest weight',
        ],
        tip: 'Use channels to understand team complexity; use PERT for schedule uncertainty.',
      },
    ],
  },
  {
    id: 'decision-leadership-mindset',
    title: 'Decision & Leadership Mindset',
    subtitle: 'Analyze, lead, engage—then act',
    category: 'mindset',
    icon: 'account-tie',
    color: '#c62828',
    sections: [
      {
        title: 'Decision-making',
        bullets: [
          'Analyze root cause before acting',
          'Assess impacts (scope, time, cost, quality, people, risk)',
          'Resolve at the lowest level; escalate only when needed',
          'Consult the team before deciding',
        ],
      },
      {
        title: 'Leadership & team',
        bullets: [
          'Servant leadership: support, empower, coach',
          'Psychological safety for open communication',
          'Coach instead of blame; celebrate progress',
        ],
      },
      {
        title: 'Stakeholders & communication',
        bullets: [
          'Identify and analyze stakeholders continuously',
          'Engage regularly with the right channels',
          'Use emotional intelligence',
        ],
        tip: 'Never do nothing—but don’t jump to extreme answers with ALWAYS/NEVER.',
      },
    ],
  },
  {
    id: 'risk-quick-notes',
    title: 'Risk Quick Notes',
    subtitle: 'Threats, opportunities, and plans',
    category: 'risk',
    icon: 'shield-alert',
    color: '#d84315',
    sections: [
      {
        title: 'Risk vs issue',
        bullets: [
          'Risk — uncertain future event (proactive) → Risk Register',
          'Issue — problem that already occurred (reactive) → Issue Log',
        ],
      },
      {
        title: 'Threat responses',
        bullets: ['Avoid', 'Mitigate', 'Transfer', 'Accept', 'Escalate'],
      },
      {
        title: 'Opportunity responses',
        bullets: ['Exploit', 'Enhance', 'Share', 'Accept', 'Escalate'],
      },
      {
        title: 'Plans & priority',
        bullets: [
          'Contingency plan — if the risk occurs',
          'Fallback plan — if contingency fails',
          'Priority ≈ Probability × Impact',
        ],
        tip: 'Identify early, assign ownership, reassess regularly.',
      },
    ],
  },
  {
    id: 'change-control',
    title: 'Integrated Change Control',
    subtitle: 'Assess → decide → communicate → implement',
    category: 'process',
    icon: 'file-replace',
    color: '#4527a0',
    sections: [
      {
        title: 'Typical predictive flow',
        bullets: [
          '1. Document the change request',
          '2. Assess impact (scope, schedule, cost, quality, resources, risk, stakeholders)',
          '3. CCB review',
          '4. Approve or reject (document either way)',
          '5. Update baselines/documents',
          '6. Communicate the decision',
          '7. Implement',
          '8. Validate results',
        ],
      },
      {
        title: 'Agile nuance',
        bullets: [
          'Change is expected via backlog refinement and sprint planning',
          'Product Owner prioritizes; formal CCB is usually not required',
        ],
        tip: 'Always assess impact before implementing—even for urgent changes (still document).',
      },
    ],
  },
  {
    id: 'stakeholder-grid',
    title: 'Power–Interest Grid',
    subtitle: 'Engage the right way at the right time',
    category: 'people',
    icon: 'account-group',
    color: '#00695c',
    sections: [
      {
        title: 'Four strategies',
        bullets: [
          'High power + high interest → Manage closely',
          'High power + low interest → Keep satisfied',
          'Low power + high interest → Keep informed',
          'Low power + low interest → Monitor',
        ],
      },
      {
        title: 'Engagement levels',
        bullets: ['Unaware', 'Resistant', 'Neutral', 'Supportive', 'Leading'],
      },
      {
        title: 'Mindset',
        bullets: [
          'Tailor communication to needs and influence',
          'Reassess power/interest as stakeholders change',
          'Use emotional intelligence',
        ],
      },
    ],
  },
  {
    id: 'servant-leadership',
    title: 'Servant Leadership',
    subtitle: 'Empower people · Remove obstacles · Deliver value',
    category: 'people',
    icon: 'hand-heart',
    color: '#2e7d32',
    sections: [
      {
        title: 'A servant leader…',
        bullets: [
          'Coaches and mentors',
          'Removes delivery blockers',
          'Facilitates collaboration and self-organization',
          'Listens actively; builds psychological safety',
          'Puts team success first',
        ],
      },
      {
        title: 'Not servant leadership',
        bullets: [
          'Micromanaging or command-and-control',
          'Blame instead of coaching',
          'Creating fear or blocking autonomy',
        ],
        tip: 'Exam answers usually favor coaching, collaboration, and empowerment over authority.',
      },
    ],
  },
  {
    id: 'conflict-resolution',
    title: 'Conflict Resolution',
    subtitle: 'Collaborate first whenever possible',
    category: 'people',
    icon: 'handshake',
    color: '#ad1457',
    sections: [
      {
        title: 'Approaches (most → least preferred)',
        bullets: [
          '1. Collaborate / Problem-solve — win-win, root cause',
          '2. Compromise / Reconcile — each side gives something',
          '3. Smooth / Accommodate — emphasize agreement',
          '4. Force / Direct — authority for urgent/safety cases',
          '5. Withdraw / Avoid — cool down or gather info (temporary)',
        ],
      },
      {
        title: 'Choose based on',
        bullets: [
          'Relationship importance',
          'Urgency and risk',
          'Impact and complexity',
          'Power balance',
        ],
        tip: 'Use EI: listen, stay calm, address interpersonal conflict privately.',
      },
    ],
  },
  {
    id: 'quality-concepts',
    title: 'Quality Concepts',
    subtitle: 'Plan quality in—don’t inspect it in',
    category: 'process',
    icon: 'medal',
    color: '#00897b',
    sections: [
      {
        title: 'Quality vs grade',
        bullets: [
          'Quality = conformance to requirements / fitness for use',
          'Grade = feature level or classification',
          'Low grade can be OK; low quality is never OK',
        ],
      },
      {
        title: 'Cost of quality',
        bullets: [
          'Prevention — stop defects',
          'Appraisal — evaluate quality',
          'Failure — internal & external defect costs',
        ],
      },
      {
        title: 'Mindset',
        bullets: [
          'Prevention over inspection',
          'PDCA continuous improvement',
          'Avoid gold plating (extras beyond approved scope)',
          'In agile: build → test → feedback → release',
        ],
      },
    ],
  },
  {
    id: 'situational-traps',
    title: 'Situational Traps to Avoid',
    subtitle: 'Choose the BEST answer, not the perfect one',
    category: 'exam',
    icon: 'alert-octagon',
    color: '#b71c1c',
    sections: [
      {
        title: 'Avoid these patterns',
        bullets: [
          'Escalating as the first step',
          'Acting without assessing impact or root cause',
          'Implementing change without approval (predictive)',
          'Absolute words: ALWAYS / NEVER / ONLY',
          'Blame, threats, or extreme unilateral actions',
          'Ignoring stakeholders or solving alone',
        ],
      },
      {
        title: 'Prefer instead',
        bullets: [
          'Analyze → assess → consult → communicate',
          'Solve at the lowest level first',
          'Engage stakeholders continuously',
          'Apply lessons learned; deliver incremental value',
        ],
        tip: 'Eliminate extreme options first, then pick the most balanced remaining answer.',
      },
    ],
  },
  {
    id: 'exam-strategy',
    title: 'Exam Strategy & Tips',
    subtitle: 'Work smart · Stay calm · Pick BEST',
    category: 'exam',
    icon: 'target',
    color: '#e65100',
    sections: [
      {
        title: 'Question analysis',
        bullets: [
          'Spot keywords: FIRST, NEXT, BEST, MOST LIKELY, EXCEPT',
          'Reading the last sentence first can clarify the ask',
          'Focus on what the PM should do',
        ],
      },
      {
        title: 'Elimination',
        bullets: [
          'Cut absolutes and unrealistic extremes',
          'Cut options that skip analysis or communication',
          'Cut blame/force and options that don’t protect value',
        ],
      },
      {
        title: 'Time & mindset',
        bullets: [
          '~1.3 minutes per question; mark and return',
          'Use breaks; manage energy',
          'Trust preparation; progress over perfection',
        ],
      },
    ],
  },
  {
    id: 'first-next-framework',
    title: 'FIRST / NEXT Framework',
    subtitle: 'Understand → Analyze → Consult → Review → Act → Monitor',
    category: 'exam',
    icon: 'order-bool-ascending-variant',
    color: '#283593',
    sections: [
      {
        title: 'Preferred sequence',
        bullets: [
          '1. Understand — clarify facts',
          '2. Analyze — root cause and impacts',
          '3. Consult — team and stakeholders',
          '4. Review — plans, logs, policies',
          '5. Act — implement the approved action',
          '6. Monitor — track results and adapt',
        ],
      },
      {
        title: 'Then, if needed',
        bullets: [
          'Escalate (after lower-level attempts)',
          'Implement approved solutions',
          'Reassign/replace as last resort',
          'Reject options that don’t add value',
        ],
        tip: 'Don’t jump straight to escalate/reject before analysis.',
      },
    ],
  },
  {
    id: 'key-documents',
    title: 'Key Documents & Artifacts',
    subtitle: 'Living documents that drive decisions',
    category: 'process',
    icon: 'file-document-multiple',
    color: '#37474f',
    sections: [
      {
        title: 'Registers & logs',
        bullets: [
          'Risk Register — risks, responses, owners',
          'Issue Log — current problems and status',
          'Stakeholder Register — influence and engagement',
          'Change Log — requested/approved changes',
          'Lessons Learned Register — capture continuously',
        ],
      },
      {
        title: 'Other key artifacts',
        bullets: [
          'Requirements Traceability Matrix (RTM)',
          'Communications Management Plan',
          'Product backlog (agile) — PO prioritizes',
        ],
        tip: 'Most project documents are living—review and update them throughout.',
      },
    ],
  },
];

export function getLearningTopic(id: string): LearningTopic | undefined {
  return LEARNING_TOPICS.find((t) => t.id === id);
}

export function getTopicsByCategory(
  category: LearningCategory | 'all'
): LearningTopic[] {
  if (category === 'all') return LEARNING_TOPICS;
  return LEARNING_TOPICS.filter((t) => t.category === category);
}
