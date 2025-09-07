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

export async function placeOrder(userId: number) {
  const cart = await cartQueries.getCartByUser(userId)
  if (!cart) return null

  const cartItems = await cartQueries.getCartItemsByCart(cart.id)
  if (!cartItems || cartItems.length === 0) return null

  
  const orderItems = cartItems.map(ci => ({
    productId: ci.product_id,
    qty: ci.quantity ?? 1,
    unitprice: ci.unitprice,
  }))

  const orderTotal = orderItems.reduce((sum, it) => sum + it.unitprice * it.qty, 0)

  const order = await createOrder(cart.user_id ?? userId, orderItems, orderTotal)

  const productIdsOrdered = Array.from(new Set(orderItems.map(i => i.productId)))
  for (const pid of productIdsOrdered) {
    await cartQueries.deleteItemFromCart(cart.id, pid)
  }

  return order
}