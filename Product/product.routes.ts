import {Router} from 'express'
const productRouter = Router()
import { authenticateJWT } from '../auth/auth.middleware'
import * as productController from './product.controller'

productRouter.post('/create',authenticateJWT,productController.createProduct)
productRouter.get('/product/:productId', productController.getProductById)
productRouter.patch('/update',authenticateJWT,productController.updateProductInfo)
productRouter.delete('/remove/:productId',authenticateJWT,productController.deleteProduct)
productRouter.get('/products/all',authenticateJWT,productController.returnAllProducts)

export default productRouter;