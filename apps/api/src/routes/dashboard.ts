import express from 'express';
import { getDashboardStats } from '../controllers/dashboard';
import { protect, authorize } from '../middleware/auth';
import { ROLES } from '@intelligen/constants';

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/', getDashboardStats);

export default router;
