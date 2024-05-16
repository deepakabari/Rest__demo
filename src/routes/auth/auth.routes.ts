import * as authLogin from '../../controllers/user.controller';
import express from 'express';

const router = express.Router();

router.post('/login', authLogin.login);

export default router;
