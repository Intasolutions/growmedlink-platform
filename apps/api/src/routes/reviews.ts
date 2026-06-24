import { Router } from 'express';
import { 
  listPublicReviews, 
  submitReview, 
  getReviewById, 
  listAdminReviews, 
  updateReview, 
  deleteReview 
} from '../controllers/reviews.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', listPublicReviews);
router.post('/', submitReview);

// Admin-only protected routes
router.get('/admin', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), listAdminReviews);
router.get('/id/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getReviewById);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateReview);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteReview);

export default router;
