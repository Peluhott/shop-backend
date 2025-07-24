import { Router } from 'express'
const cartRouter = Router();
import * as cartController from './cart.controller'
import { authenticateJWT } from '../auth/auth.middleware';

cartRouter.get('/cart', authenticateJWT,cartController.retrieveCartForUser)
cartRouter.delete('/cart/:productID/remove', authenticateJWT, cartController.removeItemFromCart)
cartRouter.post('/cart/:productID/add',authenticateJWT,cartController.addItemToCart)
cartRouter.patch('/cart/item/:productId/increase', authenticateJWT,cartController.increaseQuantityItemFromCart)
cartRouter.patch('/cart/item/:productId/decrease', authenticateJWT,cartController.decreaseQuantityItemFromCart)
cartRouter.get('/cart/subtotal',authenticateJWT,cartController.subtotalOfCart)
cartRouter.post('/cart/placeorder',authenticateJWT,cartController.placeOrderOfCart)