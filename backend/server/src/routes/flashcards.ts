import { Router } from 'express';
import {
  getFlashcards,
  getKnowledgeAreas,
  getMarkedFlashcards,
  toggleMarkFlashcard,
  recordFlashcardReview,
} from '../controllers/flashcardController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Browse catalog without login (optional auth enriches marked state)
router.get('/', optionalAuthenticate, getFlashcards);
router.get('/knowledge-areas', getKnowledgeAreas);

// User-scoped flashcard actions require auth
router.get('/marked', authenticate, getMarkedFlashcards);
router.post('/:flashcardId/mark', authenticate, toggleMarkFlashcard);
router.post('/review', authenticate, recordFlashcardReview);

export default router;
