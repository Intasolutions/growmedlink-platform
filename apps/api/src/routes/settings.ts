import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '@intelligen/constants';

const router = Router();

// Publicly available so frontend can fetch global context (headers/footers)
router.get('/', getSettings);

// Protected Admin Route
router.put('/', authenticate, authorize(ROLES.SUPER_ADMIN), updateSettings);

export default router;
