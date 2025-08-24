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

export async function getTopSellingProducts(limit: number) {
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

