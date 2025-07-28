import {Request , Response} from 'express'
import * as cartQueries from './cart.repository'
import { createOrder } from '../Order/order.repository'
// check all status codes to make sure right one were used
export async function retrieveCartForUser(req:Request, res: Response) {
   try {
    
    const cart = await cartQueries.getCartByUser(req.user!.id)
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
       const cart = await cartQueries.getCartByUser(req.user!.id)
       if(!cart){
        return res.status(404).json({message:'cart could not be found'})
       }
        await cartQueries.deleteItemFromCart(cart.id, productID)
        return res.status(204).send()
    } catch (error) {
        res.status(500).json({message:'unable to delete item'})
    }
}

export async function addItemToCart(req : Request, res: Response) {
   
    try { // add validation later
        const cart = await cartQueries.getCartByUser(req.user!.id)
        if(!cart){
            return res.status(404).json({message:'cart could not be found'})
           }
        const {productId, quantity = 1, unitPrice} = req.body
        await cartQueries.addItemToCart(cart.id,productId,quantity,unitPrice)
        return res.status(201).send()
    } catch (error) {
        res.status(500).json({message:'item insert failed'})
    }
}

export async function increaseQuantityItemFromCart(req : Request, res: Response) {
    try { // add validation
        const cart = await cartQueries.getCartByUser(req.user!.id)
        if(!cart){
            return res.status(404).json({message:'cart could not be found'})
           }
        const productID = parseInt(req.params.id, 10);
        const {quantity} = req.body
        const cartItem = await cartQueries.getCartItemFromCart(cart.id, productID)
        if(!cartItem){
            return res.status(404).json({message:'cart item could not be found'})
        }
        await cartQueries.increaseCartItemStock(cartItem.id,quantity)
        return res.status(204).send()
    } catch (error) {
        res.status(500).json({message:'increase failed'})
    }
}
export async function decreaseQuantityItemFromCart(req : Request, res: Response) {
    try { // add validation
        const cart = await cartQueries.getCartByUser(req.user!.id)
        if(!cart){
            return res.status(404).json({message:'cart could not be found'})
           }
        const productID = parseInt(req.params.id, 10);
        const {quantity} = req.body
        const cartItem = await cartQueries.getCartItemFromCart(cart.id, productID)
        if(!cartItem){
            return res.status(404).json({message:'cart item could not be found'})
        }
        await cartQueries.decreaseCartItemStock(cartItem.id,quantity)
        return res.status(204).send()
    } catch (error) {
        res.status(500).json({message:'decrease failed'})
    }
}
export async function subtotalOfCart(req : Request, res: Response) {
    try { // add validation
        const cart = await cartQueries.getCartByUser(req.user!.id)
        if(!cart){
            return res.status(404).json({message:'cart could not be found'})
           }
        const subtotal = await cartQueries.getCartTotal(cart.id)
        return res.status(200).json({subtotal})
    } catch (error) {
        return res.status(500).json({message:'could not calculate subtotal of cart'})
    }
}
export async function placeOrderOfCart(req : Request, res: Response) {
        const userId = req.user!.id
    const {items, orderTotal} = req.body
        if(!userId || !Array.isArray(items) || items.length ==0 || typeof orderTotal !== 'number') {
            return res.status(400).json({message:'invalid input'})
        }
    try {
        await createOrder(userId, items, orderTotal)
        return res.status(201).json({message:'order Created successfully'})
    } catch (error) {
        return res.status(500).json({message:'order creation failed'})
    }
}
// remove items from cart
// add items to cart
//increase quantity
//decrease quantity

// subtotal of cart
// placing the order