import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '@intelligen/constants';

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/', getDashboardStats);

export default router;
