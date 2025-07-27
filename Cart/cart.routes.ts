import { Router } from 'express'
const cartRouter = Router();
import * as cartController from './cart.controller'
import { authenticateJWT } from '../auth/auth.middleware';

cartRouter.get('/', authenticateJWT,cartController.retrieveCartForUser)
cartRouter.delete('/:productID/remove', authenticateJWT, cartController.removeItemFromCart)
cartRouter.post('/:productID/add',authenticateJWT,cartController.addItemToCart)
cartRouter.patch('/item/:productId/increase', authenticateJWT,cartController.increaseQuantityItemFromCart)
cartRouter.patch('/item/:productId/decrease', authenticateJWT,cartController.decreaseQuantityItemFromCart)
cartRouter.get('/subtotal',authenticateJWT,cartController.subtotalOfCart)
cartRouter.post('/placeorder',authenticateJWT,cartController.placeOrderOfCart)

export default cartRouter;