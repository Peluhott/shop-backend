import express from 'express'
import { loginUser } from './user.controller'

const router = express.Router();



router.post("/login", async (req: any, res: any) => {
    try {
      const token = await loginUser(req.body);
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  });

  export default router;