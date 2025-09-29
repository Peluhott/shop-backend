import * as productQueries from './product.repository'
import { uploadProductImage } from '../utils/uploadImage'

export async function createProductWithImage(productData: any, file: Express.Multer.File) {
    const { name, category, description, price, stock } = productData
    const url = await uploadProductImage(file)
    if (!name || !category || !description || isNaN(price) || isNaN(stock) || !url) {
        throw new Error('Missing or invalid product fields')
    }
    return await productQueries.createProduct(name, category, url, description, price, stock)
}

export async function getProductById(id: number) {
    return await productQueries.getProductById(id)
}

export async function updateProductInfo(id: number, data: any) {
    const { name, category, picture, description, price, stock } = data
    return await productQueries.updateProduct(id, name, category, picture, description, price, stock)
}

export async function deleteProduct(id: number) {
    return await productQueries.deleteProduct(id)
}

// Updated to accept pagination params
export async function getAllProducts(page?: number, limit?: number) {
    return await productQueries.getAllProducts(page, limit)
}

export async function getProductsByFilter(filter: string, value: any) {
    return await productQueries.getProductByFilter(filter as any, value)
}

export async function searchProducts(search: string) {
    return await productQueries.searchProductsMatching(search)
}

export async function getTopSellingProducts(limit: number) {
    return await productQueries.getTopSellingProductsQuant(limit)
}

export async function getTopSellingProductsByDollar(limit: number) {
    return await productQueries.getTopSellingProductsRevenue(limit); // This should use your revenue logic in the repository
}