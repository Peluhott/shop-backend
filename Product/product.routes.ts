import {Router} from 'express'
const productRouter = Router()
import { authenticateJWT } from '../auth/auth.middleware'
import * as productController from './product.controller'
import { checkAdmin } from '../middleware/isAdmin'
import { validateRequest } from '../middleware/validateRequest'
import { productInfoValidation,  retrieveProductValidator} from '../validation/productValidator'
productRouter.get('/all', productController.returnAllProducts) 
productRouter.post('/create',authenticateJWT,checkAdmin, productInfoValidation, validateRequest,productController.createProduct)
productRouter.get('/:productId',retrieveProductValidator, validateRequest, productController.getProductById)
productRouter.patch('/update',authenticateJWT,checkAdmin, productInfoValidation, validateRequest, productController.updateProductInfo)
productRouter.delete('/remove/:productId',authenticateJWT,checkAdmin, retrieveProductValidator, validateRequest, productController.deleteProduct)
// add pagination
//reorder routes
export default productRouter;