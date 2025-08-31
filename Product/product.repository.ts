import { Prisma } from '@prisma/client'
import prisma from '../shared/prisma'

export async function createProduct(name: string, category: string, picture: string, description: string, price: number, stock: number) {
    return await prisma.product.create({
        data: { name, category, picture, description, price, stock }
    })
}

export async function getProductById(id: number) {
    return await prisma.product.findUnique({
        where: { id }
    })
}

export async function getAllProducts() {
    return await prisma.product.findMany()
}

export async function updateProduct(productId: number, name: string, category: string, picture: string, description: string, price: number, stock: number) {
    return await prisma.product.update({
        where: { id: productId },
        data: { name, category, picture, description, price, stock }
    })
}

export async function deleteProduct(id: number) {
    return await prisma.product.delete({
        where: { id }
    })
}

export async function decreaseStock(id: number, change: number) {
    
    return await prisma.product.update({
        where: { id },
        data: { stock: { decrement: change } }
    })
}

export async function increaseStock(id: number, change: number) {
    return await prisma.product.update({
        where: { id },
        data: { stock: { increment: change } }
    })
}

export async function isProductInStock(id: number) {
    const result = await prisma.product.findUnique({
        where: { id }
    })
    return result !== null && result.stock > 0
}

/**
 * Filter products by a specific field and value.
 * Example: getProductByFilter('category', 'shirts')
 */
export async function getProductByFilter<k extends keyof Prisma.productWhereInput>(filter: k, value: Prisma.productWhereInput[k]) {
    return await prisma.product.findMany({
        where: { [filter]: value }
    })
}

export async function searchProductsMatching(search: string) {
    return await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }
    })
}

export async function getTopSellingProductsQuant(limit: number) {
    const topselling = await prisma.ordered_Products.groupBy({
        by: ['product_id'],
        _count: { product_id: true },
        orderBy: { _count: { product_id: 'desc' } },
        take: limit
    })

    const products = await Promise.all(topselling.map(async (entry) => {
        const product = await prisma.product.findUnique({
            where: { id: entry.product_id },
        })
        return {
            ...product,
            totalSold: entry._count.product_id
        }
    }))
    return products
}

export async function getLowestSellingProductsQuant(limit: number) {
    const topselling = await prisma.ordered_Products.groupBy({
        by: ['product_id'],
        _count: { product_id: true },
        orderBy: { _count: { product_id: 'asc' } },
        take: limit
    })

    const products = await Promise.all(topselling.map(async (entry) => {
        const product = await prisma.product.findUnique({
            where: { id: entry.product_id },
        })
        return {
            ...product,
            totalSold: entry._count.product_id
        }
    }))
    return products
}

export async function getTopSellingProductsRevenue(limit: number) {
  const grouped = await prisma.ordered_Products.groupBy({
    by: ['product_id'],
    _sum: { unit_price: true },        
    orderBy: { _sum: { unit_price: 'desc' } },
    take: limit,
  });

  const ids = grouped.map(g => g.product_id);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, price: true },
  });

  const byId = new Map(products.map(p => [p.id, p]));
  return grouped.map(g => ({
    ...byId.get(g.product_id),
    totalRevenue: g._sum.unit_price ?? 0
    
  }));
}

export async function getLowestSellingProductsRevenue(limit: number) {
  const grouped = await prisma.ordered_Products.groupBy({
    by: ['product_id'],
    _sum: { unit_price: true },        
    orderBy: { _sum: { unit_price: 'asc' } },
    take: limit,
  });

  const ids = grouped.map(g => g.product_id);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, price: true },
  });

  const byId = new Map(products.map(p => [p.id, p]));
  return grouped.map(g => ({
    ...byId.get(g.product_id),
    totalRevenue: g._sum.unit_price ?? 0
    
  }));
}