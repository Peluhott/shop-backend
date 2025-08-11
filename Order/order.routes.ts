import { Router} from 'express'
const orderRouter = Router();
import * as orderController from './order.controller'
import { authenticateJWT } from '../auth/auth.middleware';
import { markFilledOrUnfilledValidation } from '../validation/orderValidator';
import { validateRequest } from '../middleware/validateRequest';
import { checkAdmin } from '../middleware/isAdmin';
// don't forget to add middleware later to check for admin status for certain routes
orderRouter.get('/user', authenticateJWT, orderController.retrieveOrders)
orderRouter.get('/all',authenticateJWT, checkAdmin,orderController.retrieveAllOrders)
orderRouter.get('/unfilled',authenticateJWT, checkAdmin, orderController.retrieveAllUnfilled)
orderRouter.get('/filled',authenticateJWT, checkAdmin, orderController.retrieveFilled)
orderRouter.patch('/mark/:id',authenticateJWT, checkAdmin,markFilledOrUnfilledValidation, validateRequest,orderController.markFilledOrUnfilled)

export default orderRouter;