import { Router } from 'express';
import {
  listProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', listProducts);
router.get('/:slug', getProductBySlug);

// Admin-only detail route by ID
router.get('/id/:id', authenticate, getProductById);

// Admin/Super Admin protected CRUD write actions
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteProduct);

export default router;
