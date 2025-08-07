import * as productQueries from './product.repository'
import cloudinary from '../utils/cloudinary';
import {Request, Response} from 'express'

//create product with picture
export async function uploadProductImage(file: Express.Multer.File){
    const result =  await cloudinary.uploader.upload(file.path, {
        Folder: 'ShopProducts' 
    });
    return result.secure_url;
}
export async function createProduct(req: Request, res: Response) {
    const {name , category, description, price, stock} = req.body 
    
    
    
    const url = await uploadProductImage((req as any).file)
    if (!name || !category || !description || isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ message: "Missing or invalid product fields" });
      }
    if(!url){
        return res.status(400).json({message:'missing picture url'})
    }
      

    try {
        await productQueries.createProduct(name, category, url, description, price, stock);
        return res.status(201).json({message: 'product created!'})
    } catch (error) {
        console.log('failed to create product',error)
        return res.status(500).json({message: 'product not created'})
    }
}

export async function getProductById(req: Request, res: Response) { // can be used for product info as well
    const id = parseInt(req.params.id,10)
    try {
        const product = await productQueries.getProductById(id)
        return res.status(200).json(product)
    } catch (error) {
        console.log('failed to retrieve product', error)
        return res.status(500).json({message:'failed to retrieve product'})
    }
}

export async function updateProductInfo(req: Request, res: Response){
    const id = parseInt(req.params.id)
   const { name ,category, picture, description, price, stock} = req.body
   // figure out how i'm going to handle a picture update later
   try {//fix this function later
        await productQueries.updateProduct(id,name, category, picture, description ,price, stock); // wrong function this is suppose to be update not create
        return res.status(201).json({message:'product created successfully'})
   } catch (error) {
    console.log('product update failed', error)
    return res.status(500).json({message:'product update failed'})
   }
}
//edit product information , get and post for this

//delete product

export async function deleteProduct(req: Request, res: Response){
    const id = parseInt(req.params.id,10)
    try {
        await productQueries.deleteProduct(id)
        return res.status(204).json({message:'product deleted'})
    } catch (error) {
        console.log("product deletion failed",error)
        return res.status(500).json({message:'product deletion failed'})
    }
}

export async function returnAllProducts(req: Request, res:Response){
    try {
        const products = await productQueries.getAllProducts()
        return res.status(200).json(products)
    } catch (error) {
        console.log("failed to retrieve products",error)
        return res.status(500).json({message:'failed to retrieve products'})
    }
}




//get all products

//finish the ones under this later

//get products by certain filters

//search product

// change stock of product avaiable