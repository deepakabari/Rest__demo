import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import bookRoutes from './Book/book.routes';
import userRoutes from './user/user.routes';
import commonRoutes from './common/common.route';
import categoryRoutes from './category/category.route';

const router: Router = Router();

// route /auth
router.use('/auth', authRoutes);
router.use('/book', bookRoutes);
router.use('/user', userRoutes);
router.use('/common', commonRoutes);
router.use('/category', categoryRoutes);

export default router;
