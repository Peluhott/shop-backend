import * as orderService from './order.service'
import * as orderRepo from './order.repository'
import { Request, Response } from 'express'

export async function retrieveOrders(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'unauthorized user' })
    }
    try {
        const orders = await orderService.getOrdersByUserId(req.user.id)
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'no orders found for user' })
        }
        return res.status(200).json(orders)
    } catch (error) {
        console.log('error retrieving for user', error)
        return res.status(500).json({ message: 'failed to retrieve orders' })
    }
}

export async function retrieveOrdersByUserId(req: Request, res: Response) {
    const userId = req.params.id ? parseInt(req.params.id, 10) : undefined;
    if (!userId) {
        return res.status(400).json({ message: 'userId param required' });
    }
    try {
        const orders = await orderService.getOrdersByUserId(userId);
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'no orders found for user' });
        }
        return res.status(200).json(orders);
    } catch (error) {
        console.log('error retrieving for user', error);
        return res.status(500).json({ message: 'failed to retrieve orders' });
    }
}

export async function retrieveAllOrders(req: Request, res: Response) {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
        const orders = await orderService.getAllOrders(page, limit)
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'no orders found' })
        }
        return res.status(200).json(orders)
    } catch (error) {
        console.log('error retrieving all orders', error)
        return res.status(500).json({ message: 'unable to return orders' })
    }
}

export async function retrieveAllUnfilled(req: Request, res: Response) {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
        const orders = await orderService.getUnfilledOrders(page, limit)
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'no orders found' })
        }
        return res.status(200).json(orders)
    } catch (error) {
        console.log("error retrieving unfilled", error)
        return res.status(500).json({ message: 'error retrieving unfilled' })
    }
}

export async function retrieveFilled(req: Request, res: Response) {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
        const orders = await orderService.getFilledOrders(page, limit)
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'no orders found' })
        }
        return res.status(200).json(orders)
    } catch (error) {
        console.log("error retrieving filled orders")
        return res.status(500).json({ message: 'error retrieving filled' })
    }
}

export async function markFilledOrUnfilled(req: Request, res: Response) {
    if (!req.params.id) {
        return res.status(400).json({ message: 'invalid input' })
    }
    const id = parseInt(req.params.id, 10)
    try {
        const result = await orderService.toggleOrderFilledStatus(id)
        if (!result) {
            return res.status(404).json({ message: 'order not found' })
        }
        return res.status(204).send()
    } catch (error) {
        console.log('error marking order', error)
        return res.status(500).json({ message: 'order marking failed' })
    }
}

export async function getAverageOrderAmount(req: Request, res: Response) {
    try {
        const avg = await orderRepo.getAverageOrderAmount();
        return res.status(200).json({ averageOrderAmount: avg });
    } catch (error) {
        console.log('error getting average order amount', error);
        return res.status(500).json({ message: 'failed to get average order amount' });
    }
}



