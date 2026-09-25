import { Router } from 'express';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
} from '../controllers/bookmarkController';
import { authenticate } from '../middleware/auth';
import { requirePremium } from '../middleware/subscription';

const router = Router();

router.use(authenticate);

// Listing and mutating bookmarks requires premium.
// Existence check stays available so free practice screens don't 403.
router.get('/', requirePremium, getBookmarks);
router.post('/', requirePremium, addBookmark);
router.delete('/:questionId', requirePremium, removeBookmark);
router.get('/check/:questionId', checkBookmark);

export default router;
