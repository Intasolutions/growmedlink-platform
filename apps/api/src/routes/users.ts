import { Router } from 'express';
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/users.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '@intelligen/constants';

const router = Router();

// Only SUPER_ADMIN and ADMIN can manage users.
router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
