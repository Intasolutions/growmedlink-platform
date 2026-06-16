import { Router } from 'express';
import { uploadMedia, listMedia, deleteMedia } from '../controllers/media.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

// Protect all media endpoints with auth and RBAC (SUPER_ADMIN or ADMIN only)
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', listMedia);
router.delete('/:id', deleteMedia);

export default router;
