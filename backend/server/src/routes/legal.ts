import { Router, Request, Response, NextFunction } from 'express';

const APP_NAME = 'PMP Exam Prep';
const OPERATOR = 'Fast Track General Trading & Contracting Est';
const SUPPORT_EMAIL = 'info@pmproapp.com';
const WEBSITE_HOST = 'pmproapp.com';
const APP_STORE_URL = 'https://apps.apple.com/app/id6814282852';
const LAST_UPDATED = 'November 8, 2026';
const APPLE_EULA_URL =
  'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

function page(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${APP_NAME}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
         max-width: 720px; margin: 0 auto; padding: 32px 20px 64px; color: #1f2333; line-height: 1.6; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  h2 { font-size: 19px; margin-top: 32px; }
  .muted { color: #6b7080; font-size: 14px; }
  a { color: #5b21e6; }
  nav a { margin-right: 16px; font-size: 14px; }
</style>
</head>
<body>
<nav><a href="/">Home</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a><a href="/support">Support</a></nav>
<h1>${title}</h1>
<p class="muted">${APP_NAME} · Last updated ${LAST_UPDATED}</p>
${body}
</body>
</html>`;
}

const disclaimer = `<p>${APP_NAME} is an independent study aid. It is not affiliated with, endorsed by,
or sponsored by the Project Management Institute (PMI). PMP and PMI are registered marks of the
Project Management Institute, Inc.</p>`;

const privacy = page(
  'Privacy Policy',
  `<p>This policy explains what information ${OPERATOR} ("we") collects when you use ${APP_NAME},
how we use it, and the choices you have.</p>

<h2>Information we collect</h2>
<ul>
  <li><strong>Account information:</strong> your email address, optional first and last name, and a
  securely hashed password when you create an account.</li>
  <li><strong>Study activity:</strong> questions you answer, exam and quiz results, bookmarks,
  flashcard progress, streaks, and daily goals, so we can show your progress.</li>
  <li><strong>Subscription status:</strong> whether you have an active subscription and its expiry.
  Payments are processed by Apple; we never receive your card details.</li>
</ul>
<p>You can browse free content without an account. We do not collect location, contacts,
photos, or advertising identifiers, and we do not track you across other apps or websites.</p>

<h2>How we use information</h2>
<ul>
  <li>To provide the app, save your progress, and sync it across devices.</li>
  <li>To unlock subscription features you have purchased.</li>
  <li>To respond to support requests and keep the service secure.</li>
</ul>
<p>We do not sell your personal information and we do not show ads.</p>

<h2>Service providers</h2>
<ul>
  <li><strong>Railway</strong> hosts our servers and database.</li>
  <li><strong>RevenueCat</strong> manages in-app subscription status on our behalf.</li>
  <li><strong>Apple</strong> processes purchases through the App Store.</li>
</ul>
<p>These providers only process data as needed to provide their services to us.</p>

<h2>Retention and deletion</h2>
<p>We keep your data while your account exists. You can permanently delete your account and all
associated study data at any time in the app under <strong>Settings → Delete Account</strong>.
Deletion is immediate and cannot be undone. Deleting your account does not cancel an App Store
subscription; manage or cancel it in your Apple ID settings.</p>

<h2>Children</h2>
<p>${APP_NAME} is intended for adults preparing for a professional certification and is not
directed at children under 13.</p>

<h2>Changes</h2>
<p>We may update this policy. We will change the date above and, for material changes, notify you
in the app.</p>

<h2>Contact</h2>
<p>${OPERATOR}<br>Email: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>

${disclaimer}`
);

const terms = page(
  'Terms of Use',
  `<p>These terms govern your use of ${APP_NAME}, provided by ${OPERATOR}. By using the app you
agree to these terms and to Apple's
<a href="${APPLE_EULA_URL}">Standard Licensed Application End User License Agreement</a>.</p>

<h2>Subscriptions</h2>
<ul>
  <li>Premium features are available through auto-renewing subscriptions purchased in the App Store.</li>
  <li>Payment is charged to your Apple ID at confirmation of purchase, or when a free trial ends.</li>
  <li>Subscriptions renew automatically unless cancelled at least 24 hours before the end of the
  current period. Your account is charged for renewal within 24 hours before the period ends.</li>
  <li>You can manage or cancel subscriptions in your Apple ID account settings. Any unused portion of
  a free trial is forfeited when you purchase a subscription.</li>
  <li>Refunds are handled by Apple under its policies.</li>
</ul>

<h2>Your account</h2>
<p>Keep your login details secure. You can delete your account at any time from Settings in the app.</p>

<h2>Content</h2>
<p>Practice questions, explanations, and study materials are provided for exam preparation only. We
do not guarantee that using the app will result in passing any exam. You may not copy,
redistribute, or resell app content.</p>

<h2>Disclaimer and liability</h2>
<p>The app is provided "as is" without warranties of any kind. To the extent permitted by law, we are
not liable for indirect or consequential damages arising from your use of the app.</p>

<h2>Contact</h2>
<p>Email: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>

${disclaimer}`
);

const support = page(
  'Support',
  `<p>Need help with ${APP_NAME}? Email us at
<a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> and we will get back to you as soon as possible.</p>

<h2>Common questions</h2>
<p><strong>How do I restore my subscription on a new device?</strong><br>
Sign in, open the upgrade screen, and tap <em>Restore Purchases</em>.</p>
<p><strong>How do I cancel my subscription?</strong><br>
Open the Settings app on your iPhone or iPad, tap your name, then <em>Subscriptions</em>.</p>
<p><strong>How do I delete my account?</strong><br>
In the app, go to <em>Settings → Delete Account</em>. This permanently removes your account and
study history.</p>
<p><strong>What is free?</strong><br>
The first questions in every knowledge area, daily practice, flashcards, formulas and study topics.
Premium unlocks the full question bank, domain practice, and full mock exams.</p>

${disclaimer}`
);

const home = page(
  'Pass the PMP exam with confidence',
  `<p>${APP_NAME} is a focused study app for the Project Management Professional exam. Practice
realistic scenario questions, learn the concepts that matter, and track your readiness.</p>

<h2>What's inside</h2>
<ul>
  <li><strong>Daily practice</strong> with scenario-based questions and detailed explanations.</li>
  <li><strong>Practice by knowledge area or domain</strong> — People, Process and Business Environment.</li>
  <li><strong>Full mock exams</strong> timed like the real test.</li>
  <li><strong>Learning topics, flashcards and formulas</strong> for quick review.</li>
  <li><strong>Progress tracking</strong> so you know when you're ready.</li>
</ul>

<p><a href="${APP_STORE_URL}"><strong>Download on the App Store</strong></a></p>

<h2>Contact</h2>
<p>Questions or feedback? Email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>

${disclaimer}`
);

function send(html: string) {
  return (_req: unknown, res: Response) => {
    res.type('html').send(html);
  };
}

const router = Router();

// The bare API host keeps its JSON index at "/"; the website domain gets a homepage.
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  if (!req.hostname.endsWith(WEBSITE_HOST)) return next();
  res.type('html').send(home);
});
router.get('/privacy', send(privacy));
router.get('/terms', send(terms));
router.get('/support', send(support));

export default router;
