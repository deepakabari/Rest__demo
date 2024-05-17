import { celebrate } from 'celebrate';
import { userController } from '../../controllers';
import { Router } from 'express';

// Create a new router object
const router: Router = Router();

// POST /login
router.post('/createUser', userController.createUser);

export default router;
