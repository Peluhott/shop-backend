import * as orderQueries from './order.repository'

export async function getOrdersByUserId(userId: number) {
    return await orderQueries.getOrdersByUserId(userId)
}

export async function getAllOrders(page?: number, limit?: number) {
    return await orderQueries.getAllOrders(page, limit)
}

export async function getUnfilledOrders(page?: number, limit?: number) {
    return await orderQueries.getUnfilledOrders(page, limit)
}

export async function getFilledOrders(page?: number, limit?: number) {
    return await orderQueries.getFilledOrders(page, limit)
}

export async function getOrderBetweenDates(start: Date, end: Date, page?: number, limit?: number) {
    return await orderQueries.getOrderBetweenDates(start, end, page, limit)
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