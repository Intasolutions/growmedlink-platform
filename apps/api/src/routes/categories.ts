import { Router } from 'express';
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', listCategories);

// Admin-only detail route by ID
router.get('/:id', authenticate, getCategoryById);

// Admin/Super Admin protected CRUD write actions
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createCategory);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateCategory);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteCategory);

export default router;
