import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

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

