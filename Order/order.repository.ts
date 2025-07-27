import prisma from '../shared/prisma'
                                                        // check to see if this is right
export async function createOrder(user_id: number, items: {productId: number, qty: number, unitprice: number}[], orderTotal: number) {
    return await prisma.$transaction(async (tx)=> {
        
        const order = await tx.order.create({
            data: {
                user_id,
                total: orderTotal,
                filled: false

            }
        });

        await tx.ordered_Products.createMany({ // check to see if this works
            data: items.map((i) => ({
                order_id: order.id,
                product_id: i.productId,
                quantity: i.qty,
                unit_price: i.unitprice
            })),
        });

        for(const i of items){
            await tx.product.update({
                where: {id: i.productId},
                data: {stock: {decrement:i.qty}}
            });
        }
        return order;
    })
}

export async function getOrderById(id: number) {
    return await prisma.order.findUnique({
        where: {id}
    })
}

export async function getAllOrders() {
    return await prisma.order.findMany()
}

export async function getOrdersByUserId(userID: number) {
    return await prisma.order.findMany({
        where: {user_id:userID}
    })
}

export async function updateOrderTotal(id: number, newTotal: number) {
    await prisma.order.update({
        where: {id},
        data: {total: newTotal}
    });
}

export async function deleteOrder(id: number) {
    await prisma.order.delete({
        where: {id}
    })
}

export async function markOrderFilled(id: number) {
    await prisma.order.update({
        where: {id},
        data: {filled: true}
    })
}

export async function markOrderUnfilled(id: number) {
    await prisma.order.update({
        where: {id},
        data: {filled: false}
    })
}

export async function getFilledOrders() {
    return await prisma.order.findMany({
        where: {filled: true}
    })
}

export async function getUnfilledOrders() {
    return await prisma.order.findMany({
        where: {filled: false}
    })
}

export async function getOrderBetweenDates(params:type) {
    // figure this out later
}

export async function getRecentOrders(params:type) {
    //figure this out later
}

export async function getTopCustomersByOrder(params:type) {
    //figure this out later
}

export async function getOrderSummary(params:type) {
    // gives you a report of total orders, cost, items bought etc
}

// ordered products repo

export async function getOrderedProductsByOrderId(id: number) {
    return await prisma.ordered_Products.findMany({
        where: {order_id: id}
    })
}

export async function deleteOrderProductsByOrderId(id: number) {
    await prisma.ordered_Products.deleteMany({
        where: {order_id: id}
    })
}

export async function getTopSellingProducts(timePeriod: number, numberOfProducts: number) {
    // figure this out later
}

export async function getTotalSalesOfProduct(product_id: number, timePeriod: number){
    //figure this out later
}