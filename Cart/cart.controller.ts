import { Request, Response } from 'express'
import * as cartService from './cart.service'

export async function retrieveCartForUser(req: Request, res: Response) {
    try {
        const cartItems = await cartService.getCartForUser(req.user!.id)
        if (!cartItems) {
            return res.status(404).json({ message: 'cart not found for user' })
        }
        return res.status(200).json(cartItems)
    } catch (error) {
        return res.status(500).json({ message: 'did not retrieve cart' })
    }
}

export async function removeItemFromCart(req: Request, res: Response) {
    try {
        const productID = parseInt(req.params.id, 10)
        const success = await cartService.removeItem(req.user!.id, productID)
        if (!success) {
            return res.status(404).json({ message: 'cart could not be found' })
        }
        return res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: 'unable to delete item' })
    }
}

export async function addItemToCart(req: Request, res: Response) {
    try {
        const { productId, quantity = 1, unitPrice } = req.body
        const success = await cartService.addItem(req.user!.id, productId, quantity, unitPrice)
        if (!success) {
            return res.status(404).json({ message: 'cart could not be found' })
        }
        return res.status(201).send()
    } catch (error) {
        res.status(500).json({ message: 'item insert failed' })
    }
}

export async function increaseQuantityItemFromCart(req: Request, res: Response) {
    try {
        const productID = parseInt(req.params.id, 10)
        const { quantity } = req.body
        const success = await cartService.changeItemQuantity(req.user!.id, productID, quantity, true)
        if (!success) {
            return res.status(404).json({ message: 'cart or item could not be found' })
        }
        return res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: 'increase failed' })
    }
}

export async function decreaseQuantityItemFromCart(req: Request, res: Response) {
    try {
        const productID = parseInt(req.params.id, 10)
        const { quantity } = req.body
        const success = await cartService.changeItemQuantity(req.user!.id, productID, quantity, false)
        if (!success) {
            return res.status(404).json({ message: 'cart or item could not be found' })
        }
        return res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: 'decrease failed' })
    }
}

export async function subtotalOfCart(req: Request, res: Response) {
    try {
        const subtotal = await cartService.getSubtotal(req.user!.id)
        if (subtotal === null) {
            return res.status(404).json({ message: 'cart could not be found' })
        }
        return res.status(200).json({ subtotal })
    } catch (error) {
        return res.status(500).json({ message: 'could not calculate subtotal of cart' })
    }
}

export async function placeOrderOfCart(req: Request, res: Response) {
    const userId = req.user!.id
    const { items, orderTotal } = req.body
    if (!userId || !Array.isArray(items) || items.length == 0 || typeof orderTotal !== 'number') {
        return res.status(400).json({ message: 'invalid input' })
    }
    try {
        await cartService.placeOrder(userId, items, orderTotal)
        return res.status(201).json({ message: 'order Created successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'order creation failed' })
    }
}