import { Router } from 'express';
import { bookController } from '../../controllers';
import { celebrate } from 'celebrate';
import { BookSchema } from '../../validations/bookSchema.valid';
import { upload } from '../../utils/multerConfig';
import isAuth from '../../middleware/in-auth';

const router: Router = Router();

router.get('/getAllBooks', isAuth, bookController.getAllBooks);

router.get('/getBookById/:id', isAuth, bookController.getBookById);

router.get('/getBooks', isAuth, bookController.getBooks);

// POST /createBook
router.post(
    '/createBook',
    upload.single('image'),
    isAuth,
    celebrate(BookSchema.createBook),
    bookController.createBook,
);

// PATCH /updateBook/:id
router.patch(
    '/updateBook/:id',
    upload.single('image'),
    isAuth,
    bookController.updateBook,
);

router.delete('/deleteBook/:id', isAuth, bookController.deleteBook);

export default router;
