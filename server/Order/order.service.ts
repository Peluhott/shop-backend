import * as orderQueries from './order.repository'

export async function getOrdersByUserId(userId: number) {
    return await orderQueries.getOrdersByUserId(userId)
}

export async function getAllOrders() {
    return await orderQueries.getAllOrders()
}

export async function getUnfilledOrders() {
    return await orderQueries.getUnfilledOrders()
}

export async function getFilledOrders() {
    return await orderQueries.getFilledOrders()
}

export async function toggleOrderFilledStatus(id: number) {
    const order = await orderQueries.getOrderById(id)
    if (!order) return null
    if (order.filled) {
        await orderQueries.markOrderUnfilled(id)
    } else {
        await orderQueries.markOrderFilled(id)
    }
    return true
}