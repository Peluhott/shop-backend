import * as cartQueries from './cart.repository'
import { createOrder } from '../Order/order.repository'

export async function getCartForUser(userId: number) {
    const cart = await cartQueries.getCartByUser(userId)
    if (!cart || !cart.id) return null
    const cartItems = await cartQueries.getCartItemsByCart(cart.id)
    return cartItems
}

export async function removeItem(userId: number, productID: number) {
    const cart = await cartQueries.getCartByUser(userId)
    if (!cart) return false
    await cartQueries.deleteItemFromCart(cart.id, productID)
    return true
}

export async function addItem(userId: number, productId: number, quantity: number, unitPrice: number) {
    const cart = await cartQueries.getCartByUser(userId)
    if (!cart) return false
    await cartQueries.addItemToCart(cart.id, productId, quantity, unitPrice)
    return true
}

export async function changeItemQuantity(userId: number, productID: number, quantity: number, increase: boolean) {
    const cart = await cartQueries.getCartByUser(userId)
    if (!cart) return false
    const cartItem = await cartQueries.getCartItemFromCart(cart.id, productID)
    if (!cartItem) return false
    if (increase) {
        await cartQueries.increaseCartItemStock(cartItem.id, quantity)
    } else {
        await cartQueries.decreaseCartItemStock(cartItem.id, quantity)
    }
    return true
}

export async function getSubtotal(userId: number) {
    const cart = await cartQueries.getCartByUser(userId)
    if (!cart) return null
    const subtotal = await cartQueries.getCartTotal(cart.id)
    return subtotal
}

export async function placeOrder(userId: number, items: any[], orderTotal: number) {
    await createOrder(userId, items, orderTotal)
}