import * as productQueries from './product.repository'
import { uploadProductImage } from '../utils/uploadImage'
import { cachePrefixes, getOrSetCache, invalidateCachePrefixes } from '../utils/cache'
import { normalizeCursorPagination } from '../utils/pagination'

export async function createProductWithImage(productData: any, file: Express.Multer.File) {
    const { name, category, description, price, stock } = productData
    const url = await uploadProductImage(file)
    if (!name || !category || !description || isNaN(price) || isNaN(stock) || !url) {
        throw new Error('Missing or invalid product fields')
    }
    const product = await productQueries.createProduct(name, category, url, description, price, stock)
    await invalidateProductCache()
    return product
}

export async function getProductById(id: number) {
    return await getOrSetCache(
        `${cachePrefixes.customerProducts}id:${id}`,
        () => productQueries.getProductById(id)
    )
}

export async function updateProductInfo(id: number, data: any) {
    const { name, category, picture, description, price, stock } = data
    const updatedProduct = await productQueries.updateProduct(id, name, category, picture, description, price, stock)
    await invalidateProductCache()
    return updatedProduct
}

export async function deleteProduct(id: number) {
    const deletedProduct = await productQueries.deleteProduct(id)
    await invalidateProductCache()
    return deletedProduct
}

export async function getAllProducts(cursor?: number, limit?: number, category?: string) {
    const pagination = normalizeCursorPagination(limit, cursor)

    return await getOrSetCache(
        `${cachePrefixes.customerProducts}all:${JSON.stringify({
            cursor: pagination.cursor ?? null,
            limit: pagination.limit,
            category: category ?? null
        })}`,
        () => productQueries.getAllProducts(pagination.cursor, pagination.limit, category)
    )
}

export async function getProductsByFilter(filter: string, value: any) {
    return await getOrSetCache(
        `${cachePrefixes.customerProducts}filter:${JSON.stringify({ filter, value })}`,
        () => productQueries.getProductByFilter(filter as any, value)
    )
}

export async function searchProducts(search: string) {
    return await getOrSetCache(
        `${cachePrefixes.customerProducts}search:${search}`,
        () => productQueries.searchProductsMatching(search)
    )
}

export async function getTopSellingProducts(limit: number) {
    return await getOrSetCache(
        `${cachePrefixes.adminProducts}top-quantity:${limit}`,
        () => productQueries.getTopSellingProductsQuant(limit)
    )
}

export async function getTopSellingProductsByDollar(limit: number) {
    return await getOrSetCache(
        `${cachePrefixes.adminProducts}top-dollar:${limit}`,
        () => productQueries.getTopSellingProductsRevenue(limit)
    )
}

export async function getStoreAnalytics() {
    return await getOrSetCache(`${cachePrefixes.adminProducts}analytics`, async () => {
        const [totalDollarSold, totalQuantitySold] = await Promise.all([
            productQueries.getTotalDollarSoldStore(),
            productQueries.getTotalQuantitySoldStore()
        ])

        return {
            totalDollarSold,
            totalQuantitySold
        }
    })
}

export async function invalidateProductCache() {
    await invalidateCachePrefixes([
        cachePrefixes.customerProducts,
        cachePrefixes.adminProducts
    ])
}
