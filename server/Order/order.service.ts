import * as orderQueries from './order.repository'
import { cachePrefixes, getOrSetCache, invalidateCachePrefixes } from '../utils/cache'

export async function getOrdersByUserId(userId: number) {
    return await orderQueries.getOrdersByUserId(userId)
}

export async function getAdminOrdersByUserId(userId: number) {
    return await getOrSetCache(
        `${cachePrefixes.adminOrders}user:${userId}`,
        () => orderQueries.getOrdersByUserId(userId)
    )
}

export async function getAllOrders(page?: number, limit?: number) {
    return await getOrSetCache(
        `${cachePrefixes.adminOrders}all:${JSON.stringify({ page: page ?? null, limit: limit ?? null })}`,
        () => orderQueries.getAllOrders(page, limit)
    )
}

export async function getUnfilledOrders(page?: number, limit?: number) {
    return await getOrSetCache(
        `${cachePrefixes.adminOrders}unfilled:${JSON.stringify({ page: page ?? null, limit: limit ?? null })}`,
        () => orderQueries.getUnfilledOrders(page, limit)
    )
}

export async function getFilledOrders(page?: number, limit?: number) {
    return await getOrSetCache(
        `${cachePrefixes.adminOrders}filled:${JSON.stringify({ page: page ?? null, limit: limit ?? null })}`,
        () => orderQueries.getFilledOrders(page, limit)
    )
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
    await invalidateAdminOrderCache()
    return true
}

export async function getAverageOrderAmount() {
    return await getOrSetCache(
        `${cachePrefixes.adminOrders}average`,
        () => orderQueries.getAverageOrderAmount()
    )
}

export async function invalidateAdminOrderCache() {
    await invalidateCachePrefixes([cachePrefixes.adminOrders])
}
