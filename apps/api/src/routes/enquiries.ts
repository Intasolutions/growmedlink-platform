import { Router } from 'express';
import { createEnquiry, getEnquiries, getEnquiryById, updateEnquiry, deleteEnquiry } from '../controllers/enquiries.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '@intelligen/constants';
import rateLimit from 'express-rate-limit';

const router = Router();

const enquiryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 submissions per IP
  message: { success: false, message: 'Too many requests from this IP, please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public
router.post('/', enquiryRateLimiter, createEnquiry);

// Protected Admin Routes
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR));

router.get('/', getEnquiries);
router.get('/:id', getEnquiryById);
router.put('/:id', updateEnquiry);
router.delete('/:id', authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), deleteEnquiry);

export default router;
