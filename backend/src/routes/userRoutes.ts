import { Router } from 'express';
import {
  createUser, deleteUser, getUserById, getUsers, updateProfile, updateUser,
} from '../controllers/userController';
import { authorize, protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.put('/profile', updateProfile); // phải đặt TRƯỚC '/:id'

router.use(authorize('admin')); // từ đây trở xuống chỉ admin
router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;