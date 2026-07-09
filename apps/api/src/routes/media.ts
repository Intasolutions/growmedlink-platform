import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { uploadMedia, uploadPublicReviewPhoto, listMedia, deleteMedia } from '../controllers/media.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload, publicUpload } from '../middlewares/multer.js';

const router = Router();

// Tight rate limit for public review photo uploads — 5 per IP per hour
const publicUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many photo uploads. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public endpoint — review photo only, 2 MB raster images, rate-limited, magic-byte validated
router.post('/upload/public-review', publicUploadLimiter, publicUpload.single('file'), uploadPublicReviewPhoto);

// Protect all other media endpoints with auth and RBAC (SUPER_ADMIN or ADMIN only)
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', listMedia);
router.delete('/:id', deleteMedia);

export default router;
