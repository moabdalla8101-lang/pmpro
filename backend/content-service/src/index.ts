import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { apiRateLimiter } from './middleware/rateLimiter';
import questionRoutes from './routes/questions';
import knowledgeAreaRoutes from './routes/knowledgeAreas';
import certificationRoutes from './routes/certifications';
import importExportRoutes from './routes/importExport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

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
app.use('/api/questions', apiRateLimiter, questionRoutes);
app.use('/api/knowledge-areas', apiRateLimiter, knowledgeAreaRoutes);
app.use('/api/certifications', apiRateLimiter, certificationRoutes);
app.use('/api/import-export', apiRateLimiter, importExportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'content-service' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Content Service running on port ${PORT}`);
});


