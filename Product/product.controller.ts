import * as productService from './product.service'
import { Request, Response } from 'express'

export async function createProduct(req: Request, res: Response) {
    try {
        await productService.createProductWithImage(req.body, (req as any).file)
        return res.status(201).json({ message: 'product created!' })
    } catch (error: any) {
        console.log('failed to create product', error)
        return res.status(400).json({ message: error.message || 'product not created' })
    }
}

export async function getProductById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10)
    try {
        const product = await productService.getProductById(id)
        return res.status(200).json(product)
    } catch (error) {
        console.log('failed to retrieve product', error)
        return res.status(500).json({ message: 'failed to retrieve product' })
    }
}

export async function updateProductInfo(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10)
    try {
        await productService.updateProductInfo(id, req.body)
        return res.status(200).json({ message: 'product updated successfully' })
    } catch (error) {
        console.log('product update failed', error)
        return res.status(500).json({ message: 'product update failed' })
    }
}

export async function deleteProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10)
    try {
        await productService.deleteProduct(id)
        return res.status(204).json({ message: 'product deleted' })
    } catch (error) {
        console.log('product deletion failed', error)
        return res.status(500).json({ message: 'product deletion failed' })
    }
}

export async function returnAllProducts(req: Request, res: Response) {
    try {
        const products = await productService.getAllProducts()
        return res.status(200).json(products)
    } catch (error) {
        console.log('failed to retrieve products', error)
        return res.status(500).json({ message: 'failed to retrieve products' })
    }
}

export async function getProductsByFilter(req: Request, res: Response) {
    const { filter, value } = req.body
    try {
        const products = await productService.getProductsByFilter(filter, value)
        return res.status(200).json(products)
    } catch (error) {
        console.log('failed to return products', error)
        return res.status(500).json({ message: 'failed to return products' })
    }
}

export async function searchProduct(req: Request, res: Response) {
    const { search } = req.body
    try {
        const products = await productService.searchProducts(search)
        return res.status(200).json(products)
    } catch (error) {
        console.log('unable to find products', error)
        return res.status(500).json({ message: 'couldnt find products matching name' })
    }
}

export async function getTopSellingProducts(req: Request, res: Response) {
    const { limit } = req.query
    const limitNumber = parseInt(limit as string) || 5
    try {
        const products = await productService.getTopSellingProducts(limitNumber)
        return res.status(200).json(products)
    } catch (error) {
        console.log('trouble retrieving top products')
        return res.status(500).json({ message: 'error retrieving top products from database' })
    }
}