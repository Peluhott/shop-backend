import express from 'express'
import * as userController from './user.controller'
import { authenticateJWT } from '../auth/auth.middleware';

const router = express.Router();

router.post("/login", userController.loginUser);

router.get('/info', authenticateJWT, userController.returnUserInfo);

router.post('/create', userController.createUser);

router.post('/info/upsert', authenticateJWT, userController.upsertUserInfo);



export default router;