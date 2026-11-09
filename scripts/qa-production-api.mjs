#!/usr/bin/env node
/**
 * Production API QA matrix for PMP Exam Prep.
 * Covers guest / free / premium (cram) flows against the live API.
 */
import crypto from 'crypto';

const BASE = process.env.API_URL || 'https://api-production-45c5f.up.railway.app';
const CERT = '550e8400-e29b-41d4-a716-446655440000';
const KA_INTEGRATION = '650e8400-e29b-41d4-a716-446655440001';
const KA_SCHEDULE = '650e8400-e29b-41d4-a716-446655440003';
const KA_RISK = '650e8400-e29b-41d4-a716-446655440008';

const results = [];

function ok(name, pass, detail = '') {
  results.push({ name, pass: !!pass, detail: String(detail || '') });
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function req(path, { method = 'GET', token, body, raw = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (raw) return { res, text, json };
  return { status: res.status, json, text };
}

async function registerUser(tierHint) {
  const suffix = crypto.randomBytes(4).toString('hex');
  const email = `qa-${tierHint}-${Date.now()}-${suffix}@example.com`;
  const password = 'QaTest123!';
  const { status, json } = await req('/api/auth/register', {
    method: 'POST',
    body: {
      email,
      password,
      firstName: 'QA',
      lastName: tierHint,
    },
  });
  if (status >= 400) {
    throw new Error(`register failed ${status}: ${JSON.stringify(json)}`);
  }
  return {
    email,
    password,
    token: json.token,
    user: json.user,
  };
}

async function main() {
  console.log(`\n=== Production API QA ===\nBase: ${BASE}\n`);

  // Health
  {
    const { status, json } = await req('/health');
    ok('Health endpoint', status === 200 && json?.status === 'ok', `status=${status}`);
  }

  // Guest / free pool
  {
    const { status, json } = await req(
      `/api/questions?certificationId=${CERT}&knowledgeAreaId=${KA_INTEGRATION}&limit=25`
    );
    const n = json?.questions?.length ?? 0;
    const accessible = json?.freeAccess?.accessibleTotal;
    const full = json?.freeAccess?.fullTotal;
    ok(
      'Guest KA list capped to free pool (<=10)',
      status === 200 && n <= 10,
      `n=${n} accessible=${accessible} full=${full}`
    );
    ok(
      'Guest KA returns freeAccess metadata',
      Boolean(json?.freeAccess?.upgradeAvailable),
      JSON.stringify(json?.freeAccess || null)
    );
  }

  {
    const { status, json } = await req(
      `/api/questions?certificationId=${CERT}&domain=People&limit=10`
    );
    ok(
      'Guest domain practice blocked (403)',
      status === 403,
      `status=${status} body=${JSON.stringify(json)?.slice(0, 120)}`
    );
  }

  {
    const { status } = await req(`/api/images/exam_sim_questions/6113148.jpg`, {
      raw: true,
    }).then(async () => {
      // images are not under /api
      const res = await fetch(`${BASE}/images/exam_sim_questions/6113148.jpg`);
      return { status: res.status, bytes: (await res.arrayBuffer()).byteLength };
    }).then((r) => r);
    // rewrite above awkwardly — do direct:
  }

  {
    const res = await fetch(`${BASE}/images/exam_sim_questions/6113148.jpg`);
    const bytes = (await res.arrayBuffer()).byteLength;
    ok('Self-hosted diagram image serves', res.status === 200 && bytes > 1000, `${res.status} ${bytes}b`);
  }

  // Register free user
  const free = await registerUser('free');
  ok('Register free user', Boolean(free.token), free.email);

  {
    const { status, json } = await req('/api/subscriptions', { token: free.token });
    ok(
      'Free user subscription is free',
      status === 200 && json?.tier === 'free',
      JSON.stringify(json)
    );
  }

  {
    const { status, json } = await req(
      `/api/questions?certificationId=${CERT}&knowledgeAreaId=${KA_SCHEDULE}&limit=25`,
      { token: free.token }
    );
    const n = json?.questions?.length ?? 0;
    ok('Free user Schedule KA capped <=10', status === 200 && n <= 10, `n=${n}`);
    const ids = (json?.questions || []).map((q) => q.questionId || q.question_id);
    const diagramHits = ids.filter((id) =>
      ['SCHEDULE-11', 'SCHEDULE-18', 'SCHEDULE-19'].includes(id)
    );
    ok(
      'Free pool does not include deep diagram Qs by default',
      diagramHits.length === 0,
      `hits=${diagramHits.join(',') || 'none'}`
    );
  }

  {
    const { status } = await req(
      `/api/questions?certificationId=${CERT}&domain=Process&limit=10`,
      { token: free.token }
    );
    ok('Free user domain practice blocked', status === 403, `status=${status}`);
  }

  {
    const { status } = await req('/api/bookmarks', { token: free.token });
    ok('Free user bookmarks blocked', status === 403, `status=${status}`);
  }

  {
    const { status } = await req('/api/progress/missed-questions', {
      token: free.token,
    });
    ok('Free user missed questions blocked', status === 403, `status=${status}`);
  }

  {
    const { status, json } = await req('/api/exams/start', {
      method: 'POST',
      token: free.token,
      body: { certificationId: CERT, totalQuestions: 25, examType: 'mock_exam' },
    });
    ok('Free user mock exam blocked', status === 403, `status=${status}`);
    void json;
  }

  {
    const { status, json } = await req('/api/exams/start', {
      method: 'POST',
      token: free.token,
      body: { certificationId: CERT, totalQuestions: 2, examType: 'practice' },
    });
    ok(
      'Free user short practice exam allowed',
      status === 201 && Boolean(json?.examId),
      `status=${status}`
    );
  }

  // Premium: use known cram account if password unknown — elevate free user via DB is not available here.
  // Instead call with masoud token only if we can login; otherwise mark as skip using register + note.
  // We'll try login for masoud — likely fail without password. Create premium check via admin isn't available.
  // Soft-check: known diagram image URLs + premium gate semantics already covered.
  // Attempt login paths for test accounts if env provided.
  const premiumEmail = process.env.QA_PREMIUM_EMAIL;
  const premiumPassword = process.env.QA_PREMIUM_PASSWORD;
  let premiumToken = null;
  if (premiumEmail && premiumPassword) {
    const { status, json } = await req('/api/auth/login', {
      method: 'POST',
      body: { email: premiumEmail, password: premiumPassword },
    });
    if (status === 200 && json?.token) {
      premiumToken = json.token;
      ok('Premium login', true, premiumEmail);
    } else {
      ok('Premium login', false, `${status} ${JSON.stringify(json)}`);
    }
  } else {
    ok(
      'Premium login (skipped — set QA_PREMIUM_EMAIL/PASSWORD)',
      true,
      'skipped'
    );
  }

  if (premiumToken) {
    const { status, json } = await req('/api/subscriptions', {
      token: premiumToken,
    });
    ok(
      'Premium subscription active',
      status === 200 && json?.tier && json.tier !== 'free',
      JSON.stringify(json)
    );

    const list = await req(
      `/api/questions?certificationId=${CERT}&knowledgeAreaId=${KA_SCHEDULE}&limit=25`,
      { token: premiumToken }
    );
    ok(
      'Premium Schedule KA returns >10 questions',
      list.status === 200 && (list.json?.questions?.length || 0) > 10,
      `n=${list.json?.questions?.length}`
    );

    const domain = await req(
      `/api/questions?certificationId=${CERT}&domain=Process&limit=10`,
      { token: premiumToken }
    );
    ok(
      'Premium domain practice allowed',
      domain.status === 200 && (domain.json?.questions?.length || 0) > 0,
      `status=${domain.status} n=${domain.json?.questions?.length}`
    );

    const mock = await req('/api/exams/start', {
      method: 'POST',
      token: premiumToken,
      body: { certificationId: CERT, totalQuestions: 2, examType: 'mock_exam' },
    });
    ok(
      'Premium mock exam allowed',
      mock.status === 201 && Boolean(mock.json?.examId),
      `status=${mock.status}`
    );
  }

  // Knowledge areas catalog
  {
    const { status, json } = await req(`/api/knowledge-areas?certificationId=${CERT}`);
    const n = Array.isArray(json) ? json.length : json?.knowledgeAreas?.length;
    ok('Knowledge areas list', status === 200 && n > 5, `n=${n}`);
  }

  // Diagram question payload (by searching schedule list as guest won't include — fetch by id if public)
  {
    // Guest get single question may still be free-pool gated
    const { status, json } = await req(
      `/api/questions?certificationId=${CERT}&knowledgeAreaId=${KA_RISK}&limit=10`
    );
    ok('Risk KA guest list loads', status === 200, `n=${json?.questions?.length}`);
  }

  // Third-party CDN should be gone from active question_images
  {
    // Probe a few known former CDN files via relative path only (already checked host).
    // Additionally ensure health of other diagram assets.
    const files = [
      '650813a.jpg',
      '614008-A.jpg',
      '6113194.jpg',
      '6113191.jpg',
    ];
    let allOk = true;
    for (const f of files) {
      const res = await fetch(`${BASE}/images/exam_sim_questions/${f}`);
      if (res.status !== 200) allOk = false;
    }
    ok('All migrated diagram assets reachable', allOk, files.join(', '));
  }

  const failed = results.filter((r) => !r.pass);
  const skipped = results.filter((r) => r.detail === 'skipped');
  console.log(
    `\n=== Summary: ${results.length - failed.length - skipped.length} passed, ${failed.length} failed, ${skipped.length} skipped ===\n`
  );
  if (failed.length) {
    for (const f of failed) console.log(` - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
