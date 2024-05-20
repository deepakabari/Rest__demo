import { Router } from 'express';
import { CategoryController } from '../../controllers';
import isAuth from '../../middleware/in-auth';
import { celebrate } from 'celebrate';
import { CategorySchema } from '../../validations/category.valid';

const router: Router = Router();

router.use(isAuth);

router.get('/getCategories', CategoryController.getCategories);

router.post(
    '/createCategory',
    celebrate(CategorySchema.createCategory),
    CategoryController.createCategory,
);

router.patch(
    '/updateCategory/:id',
    celebrate(CategorySchema.createCategory),
    CategoryController.updateCategory,
);

router.delete('/deleteCategory/:id', CategoryController.deleteCategory);

export default router;
