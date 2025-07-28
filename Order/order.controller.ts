import * as orderQueries from './order.repository'
import {Request, Response} from 'express'

export async function retrieveOrders(req: Request, res: Response) {
   if(!req.user || !req.user.id){
    return res.status(401).json({message:'unauthorized user'})
   }
    try {
        const orders = await orderQueries.getOrdersByUserId(req.user.id)
        if(!orders){
            return res.status(404).json({message:'no orders found for user'})
        }
        return res.status(200).json(orders)
    } catch (error) {
        console.log('error retrieving for user', error)
        return res.status(500).json({message:'failed to retrieve orders'})
    }
}

export async function retrieveAllOrders(req: Request, res: Response) {
        try {
            const orders = await orderQueries.getAllOrders()
            if(orders.length == 0){
                return res.status(404).json({message:'no orders found'})
            }
            return res.status(200).json(orders)
        } catch (error) {
            console.log('error retrieving all orders', error)
            return res.status(500).json({message:'unable to return orders'})
        }
}

export async function retrieveAllUnfilled(req: Request, res: Response) {
    try {
        const orders = await orderQueries.getUnfilledOrders()
        if(orders.length == 0){
            return res.status(404).json({message:'no orders found'})
        }
        return res.status(200).json(orders)
    } catch (error) {
        console.log("error retrieving unfilled", error)
        return res.status(500).json({message:'error retrieving unfilled'})
    }
}

export async function retrieveFilled(req: Request, res: Response) {
    try {
        const orders = await orderQueries.getFilledOrders()
        if(orders.length == 0){
            return res.status(404).json({message: 'no orders found'})
        }
        return res.status(200).json(orders)
    } catch (error) {
        console.log("error retrieving filled orders")
        return res.status(500).json({message: 'error retrieving filled'})
    }
}

export async function markFilledOrUnfilled(req: Request, res: Response) {
    if(!req.params.id){
        return res.status(400).json({message:'invalid input'})
    }
    const id = parseInt(req.params.id,10)
    try {

        const order = await orderQueries.getOrderById(id)
        if(!order){
            return res.status(404).json({message:'order not found'})
        }
        if(order.filled == true){
            await orderQueries.markOrderUnfilled(id)
        } else { await orderQueries.markOrderFilled(id)}
        return res.status(204).send();
    } catch (error) {
        console.log('error marking order', error)
        return res.status(500).json({message:'order marking failed'})
    }
}
// retrieve orders for user
// retrieve all orders

//retireve unfilled
// retrieved filled

//mark order filled or unfilled



