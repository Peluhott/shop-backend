import express from 'express'
import {Request, Response} from 'express'
import * as userController from './user.controller'
import { authenticateJWT } from '../auth/auth.middleware';

const router = express.Router();



router.post("/login", async (req: Request, res: Response) => {
    try {
      const token = await userController.loginUser(req.body);
      return res.json({ token });
    } catch (error : any) {
      return res.status(401).json({ message: error.message });
    }
  });

router.get('/info',authenticateJWT,userController.returnUserInfo )
  export default router;