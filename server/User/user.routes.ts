import express from 'express'
import * as userController from './user.controller'
import { authenticateJWT } from '../auth/auth.middleware'
import { checkAdmin } from '../middleware/isAdmin'

const router = express.Router()

router.post("/login", userController.loginUser)

router.get('/info', authenticateJWT, userController.returnUserInfo)

router.post('/create', userController.createUser)

router.post('/info/upsert', authenticateJWT, userController.upsertUserInfo)

// Admin-only: Get all users with optional pagination
router.get('/all', authenticateJWT, checkAdmin, userController.getAllUsers)



export default router;