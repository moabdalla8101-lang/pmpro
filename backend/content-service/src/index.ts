import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
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
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/knowledge-areas', knowledgeAreaRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/import-export', importExportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'content-service' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Content Service running on port ${PORT}`);
});


