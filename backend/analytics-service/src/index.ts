import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { apiRateLimiter } from './middleware/rateLimiter';
import progressRoutes from './routes/progress';
import analyticsRoutes from './routes/analytics';
import examRoutes from './routes/exams';
import badgeRoutes from './routes/badges';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

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
app.use('/api/progress', apiRateLimiter, progressRoutes);
app.use('/api/analytics', apiRateLimiter, analyticsRoutes);
app.use('/api/exams', apiRateLimiter, examRoutes);
app.use('/api/badges', apiRateLimiter, badgeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'analytics-service' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Analytics Service running on port ${PORT}`);
});


