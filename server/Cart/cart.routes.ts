import { Router } from 'express'
const cartRouter = Router();
import * as cartController from './cart.controller'
import { authenticateJWT } from '../auth/auth.middleware';
import { removeItemValidation,addItemToCartValidation, changeQuantityValidation, placeOrderValidation} from '../validation/cartValidator';
import { validateRequest } from '../middleware/validateRequest';

cartRouter.get('/', authenticateJWT, cartController.retrieveCartForUser)

cartRouter.delete('/remove/:id', authenticateJWT, removeItemValidation, validateRequest, cartController.removeItemFromCart)

cartRouter.post('/add',authenticateJWT,addItemToCartValidation, validateRequest, cartController.addItemToCart)

cartRouter.patch('/item/increase/:productId', authenticateJWT,changeQuantityValidation,validateRequest, cartController.increaseQuantityItemFromCart)
cartRouter.patch('/item/decrease/:productId', authenticateJWT,changeQuantityValidation, validateRequest,cartController.decreaseQuantityItemFromCart)

cartRouter.get('/subtotal',authenticateJWT,cartController.subtotalOfCart)

cartRouter.post('/placeorder',authenticateJWT,validateRequest,cartController.placeOrderOfCart)

export default cartRouter;