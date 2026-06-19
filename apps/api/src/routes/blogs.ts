import { Router, Request, Response, NextFunction } from 'express';
import { 
  listBlogs, 
  getBlogBySlug, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from '../controllers/blogs.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

const router = Router();

/**
 * Optional authentication helper middleware to populate req.user if token is present
 */
const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken } = req.cookies || {};
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      const user = await User.findById(payload.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore verification errors for optional checks
  }
  next();
};

// Public feeds
router.get('/', optionalAuthenticate, listBlogs);
router.get('/:slug', optionalAuthenticate, getBlogBySlug);

// Protected detail query by ID
router.get('/id/:id', authenticate, getBlogById);

// Admin / Editor protected write operations
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createBlog);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateBlog);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), deleteBlog);

export default router;
