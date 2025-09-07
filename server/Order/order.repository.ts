
import prisma from '../utils/prisma'

export async function createOrder(user_id: number, items: {productId: number, qty: number, unitprice: number}[], orderTotal: number) {
    return await prisma.$transaction(async (tx)=> {
        
        const order = await tx.order.create({
            data: {
                user_id,
                total: orderTotal,
                filled: false

            }
        });

        await tx.ordered_Products.createMany({
            data: items.flatMap((i) =>
              Array.from({ length: i.qty }).map(() => ({
                order_id: order.id,
                product_id: i.productId,
                unit_price: i.unitprice,
              }))
            ),
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

export async function getOrderBetweenDates(start: Date, end: Date) {
    return await prisma.order.findMany({
        where: {
            created_at: {
                gte: start,
                lte: end
            }
        }
    })
}

export async function getRecentOrders(limit: number = 10) {
    return await prisma.order.findMany({
        orderBy: { created_at: 'desc' },
        take: limit
    })
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



//------------------------------analytic functions for orders and ordered products start here------------------------------
export async function getTopCustomersByOrder(limit: number = 5) {
    return await prisma.order.groupBy({
        by: ['user_id'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit
    })
}

export async function getTotalRevenueFromFilledOrders() {
    const result = await prisma.ordered_Products.aggregate({
        _sum: { unit_price: true },
        where: {
            order: {
                filled: true
            }
        }
    })
    return result._sum.unit_price ?? 0
}

export async function getTotalRevenueFromUnfilledOrders() {
    const result = await prisma.ordered_Products.aggregate({
        _sum: { unit_price: true },
        where: {
            order: {
                filled: false
            }
        }
    })
    return result._sum.unit_price ?? 0
}

export async function getTopSellingProducts(timePeriodDays: number, numberOfProducts: number) {
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - timePeriodDays)
    return await prisma.ordered_Products.groupBy({
        by: ['product_id'],
        where: {
            order: {
                created_at: { gte: sinceDate }
            }
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: numberOfProducts
    })
}

export async function getTotalSalesOfProduct(product_id: number, timePeriodDays: number) {
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - timePeriodDays)
    const sales = await prisma.ordered_Products.count({
        where: {
            product_id,
            order: {
                created_at: { gte: sinceDate }
            }
        }
    })
    return sales
}

export async function getTotalRevenueForPeriod(start?: Date, end?: Date) {
    const where: any = {}
    if (start && end) {
        where.created_at = { gte: start, lte: end }
    }
    const result = await prisma.ordered_Products.aggregate({
        _sum: { unit_price: true },
        where
    })
    return result._sum.unit_price ?? 0
}

export async function getTotalQuantityForPeriod(start?: Date, end?: Date) {
    const where: any = {}
    if (start && end) {
        where.created_at = { gte: start, lte: end }
    }
    return await prisma.ordered_Products.count({ where })
}
