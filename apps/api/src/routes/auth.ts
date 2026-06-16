import { Router } from 'express';
import { login, logout, refresh, me } from '../controllers/auth.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Public auth routes
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

// Protected routes
router.get('/me', authenticate, me);

// Verification route to test RBAC roles access
router.get(
  '/test-protected',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Access granted. Welcome to the admin zone.',
      user: {
        id: req.user?._id,
        email: req.user?.email,
        role: req.user?.role,
      },
    });
  }
);

export default router;
