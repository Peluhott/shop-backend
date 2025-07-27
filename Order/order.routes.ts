import { Router} from 'express'
const orderRouter = Router();
import * as orderController from './order.controller'
import { authenticateJWT } from '../auth/auth.middleware';
// don't forget to add middleware later to check for admin status for certain routes
orderRouter.get('/user', authenticateJWT, orderController.retrieveOrders)
orderRouter.get('/all',authenticateJWT,orderController.retrieveAllOrders)
orderRouter.get('/unfilled',authenticateJWT,orderController.retrieveAllUnfilled)
orderRouter.get('/filled',authenticateJWT,orderController.retrieveFilled)
orderRouter.patch('/mark',authenticateJWT,orderController.markFilledOrUnfilled)

export default orderRouter;