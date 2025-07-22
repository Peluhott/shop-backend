import {Request , Response} from 'express'
import * as cartQueries from './cart.repository'
import { createOrder } from '../Order/order.repository'

export async function retrieveCartForUser(req:Request, res: Response) {
   try {
    if(!req.user || !req.user.id){
        return res.status(404).json({message: ' cart not found for user'})
    }
    const cart = await cartQueries.getCartByUser(req.user.id)
    if(!cart || !cart.id){
        return res.status(404).json({message: ' cart not found for user'})
    }
    const cartItems = await cartQueries.getCartItemsByCart(cart.id)
    return res.status(200).json(cartItems)
   } catch (error) {
    return res.status(500).json({message: 'did not retrieve cart'})
   }
}


export async function removeItemFromCart(req : Request, res: Response) {
    try { // add validation
       const productID = parseInt(req.params.id,10)
        await cartQueries.deleteItemFromCart(productID)
        return res.status(204).send()
    } catch (error) {
        res.status(404).json({message:'unable to delete item'})
    }
}

export async function addItemFromCart(req : Request, res: Response) {
    try { // add validation
        const {cartID, productId, quantity = 1, unitPrice} = req.body
        await cartQueries.addItemToCart(cartID,productId,quantity,unitPrice)
        return res.status(204).send()
    } catch (error) {
        res.status(404).json({message:'item insert failed'})
    }
}

export async function increaseQuantityItemFromCart(req : Request, res: Response) {
    try { // add validation
        const itemid = parseInt(req.params.id, 10);
        const {quantity} = req.body
        await cartQueries.increaseCartItemStock(itemid,quantity)
        return res.status(204).send()
    } catch (error) {
        res.status(404).json({message:'increase failed'})
    }
}
export async function decreaseQuantityItemFromCart(req : Request, res: Response) {
    try { // add validation
        const itemid = parseInt(req.params.id, 10);
        const {quantity} = req.body
        await cartQueries.decreaseCartItemStock(itemid,quantity)
        return res.status(204).send()
    } catch (error) {
        res.status(404).json({message:'decrease failed'})
    }
}
export async function subtotalOfCart(req : Request, res: Response) {
    try { // add validation
        const cartId = parseInt(req.params.id,10)
        const subtotal = await cartQueries.getCartTotal(cartId)
        return res.status(204).json(subtotal)
    } catch (error) {
        return res.status(404).json({message:'could not calculate subtotal of cart'})
    }
}
export async function placeOrderOfCart(req : Request, res: Response) {
        const { userId, items, orderTotal} = req.body
        if(!userId || !Array.isArray(items) || items.length ==0 || typeof orderTotal !== 'number') {
            return res.status(400).json({message:'invalid input'})
        }
    try {
        await createOrder(userId, items, orderTotal)
        return res.status(201).json({message:'order Created successfully'})
    } catch (error) {
        return res.status(404).json({message:'order creation failed'})
    }
}
// remove items from cart
// add items to cart
//increase quantity
//decrease quantity

// subtotal of cart
// placing the order