import { Router } from 'express';
import {
  getFlashcards,
  getKnowledgeAreas,
  getMarkedFlashcards,
  toggleMarkFlashcard,
  recordFlashcardReview,
} from '../controllers/flashcardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getFlashcards);
router.get('/knowledge-areas', getKnowledgeAreas);
router.get('/marked', getMarkedFlashcards);
router.post('/:flashcardId/mark', toggleMarkFlashcard);
router.post('/review', recordFlashcardReview);

export default router;

