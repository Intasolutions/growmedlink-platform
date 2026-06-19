import { Router } from 'express';
import { 
  listServices, 
  getServiceBySlug, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/services.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', listServices);
router.get('/:slug', getServiceBySlug);

// Admin-only detail route by ID
router.get('/id/:id', authenticate, getServiceById);

// Admin/Super Admin protected CRUD write actions
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createService);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateService);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteService);

export default router;
