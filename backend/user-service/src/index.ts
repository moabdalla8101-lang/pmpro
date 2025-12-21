import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import subscriptionRoutes from './routes/subscriptions';
import adminRoutes from './routes/admin';
import { authRateLimiter, apiRateLimiter } from './middleware/rateLimiter';

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
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/users', apiRateLimiter, userRoutes);
app.use('/api/subscriptions', apiRateLimiter, subscriptionRoutes);
app.use('/api/admin', apiRateLimiter, adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});


