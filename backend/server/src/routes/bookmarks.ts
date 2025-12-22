import { Router } from 'express';
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark,
} from '../controllers/bookmarkController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:questionId', removeBookmark);
router.get('/check/:questionId', checkBookmark);

export default router;

