import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { authRateLimiter, apiRateLimiter } from './middleware/rateLimiter';

// Auth & User routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import subscriptionRoutes from './routes/subscriptions';
import adminRoutes from './routes/admin';

// Content routes
import questionRoutes from './routes/questions';
import knowledgeAreaRoutes from './routes/knowledgeAreas';
import certificationRoutes from './routes/certifications';
import importExportRoutes from './routes/importExport';

// Analytics routes
import progressRoutes from './routes/progress';
import analyticsRoutes from './routes/analytics';
import examRoutes from './routes/exams';
import badgeRoutes from './routes/badges';
import bookmarkRoutes from './routes/bookmarks';
import flashcardRoutes from './routes/flashcards';
import webhookRoutes from './routes/webhooks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'data:', 'http:', 'https:'],
    },
  },
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Serve static images from the project root /images directory
const imagesPath = path.join(__dirname, '../../../images');
app.use('/images', express.static(imagesPath));

// Routes with rate limiting
// Authentication routes (stricter rate limiting)
app.use('/api/auth', authRateLimiter, authRoutes);

// User & Subscription routes
app.use('/api/users', apiRateLimiter, userRoutes);
app.use('/api/subscriptions', apiRateLimiter, subscriptionRoutes);
app.use('/api/admin', apiRateLimiter, adminRoutes);

// Content routes
app.use('/api/questions', apiRateLimiter, questionRoutes);
app.use('/api/knowledge-areas', apiRateLimiter, knowledgeAreaRoutes);
app.use('/api/certifications', apiRateLimiter, certificationRoutes);
app.use('/api/import-export', apiRateLimiter, importExportRoutes);

// Analytics routes
app.use('/api/progress', apiRateLimiter, progressRoutes);
app.use('/api/analytics', apiRateLimiter, analyticsRoutes);
app.use('/api/exams', apiRateLimiter, examRoutes);
app.use('/api/badges', apiRateLimiter, badgeRoutes);
app.use('/api/bookmarks', apiRateLimiter, bookmarkRoutes);
app.use('/api/flashcards', apiRateLimiter, flashcardRoutes);

// Webhook routes (no rate limiting, but should be protected by signature verification)
app.use('/api/webhooks', webhookRoutes);

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    name: 'PMP Exam Prep API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        resetPassword: 'POST /api/auth/reset-password',
        requestPasswordReset: 'POST /api/auth/reset-password/request',
        socialLogin: 'POST /api/auth/social-login'
      },
      users: '/api/users',
      subscriptions: '/api/subscriptions',
      questions: '/api/questions',
      knowledgeAreas: '/api/knowledge-areas',
      certifications: '/api/certifications',
      progress: '/api/progress',
      analytics: '/api/analytics',
      exams: '/api/exams',
      badges: '/api/badges',
      admin: '/api/admin',
      importExport: '/api/import-export'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pmp-app-server' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 PMP Exam Prep Server running on port ${PORT}`);
  console.log(`📚 All services unified in monolith architecture`);
});

