import { Router } from 'express';
import { getPage, updatePage } from '../controllers/pages.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '@intelligen/constants';

const router = Router();

// Public
router.get('/:key', getPage);

// Protected
router.put('/:key', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR), updatePage);

export default router;
