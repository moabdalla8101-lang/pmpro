import { Router } from 'express';
import multer from 'multer';
import { exportQuestions, importQuestions } from '../controllers/importExportController';
import { authenticate, requireAdmin } from '../middleware/auth';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/import', upload.single('file'), importQuestions);
router.get('/export', exportQuestions);

export default router;


