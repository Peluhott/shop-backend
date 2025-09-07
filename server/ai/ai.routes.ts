import { Router } from "express";
const aiRouter = Router()
import { authenticateJWT } from "../auth/auth.middleware";
import { checkAdmin } from "../middleware/isAdmin";
import * as aiController from './ai.controller'

aiRouter.post('/message', authenticateJWT, checkAdmin, aiController.postMessage)
export default aiRouter;