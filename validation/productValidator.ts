import {body, param} from 'express-validator'

export const productInfoValidation = [
    body('name')
    .isString().withMessage('name must be a string')
    .notEmpty().withMessage('string can not be empty')
    .isLength({min:2,max:100}).withMessage('name must be between 2-100 characters')
    .trim(),

    body('category')
    .isString().withMessage('category must be a string')
    .notEmpty().withMessage('string can not be empty')
    .isLength({min:2,max:100}).withMessage('category must be between 2-100 characters')
    .trim(),

    body('description')
    .isString().withMessage('description must be a string')
    .notEmpty().withMessage('string can not be empty')
    .isLength({min:2,max:500}).withMessage('description must be between 2-500 characters')
    .trim(),

    body('price')
    .isFloat({gt:0})
    .withMessage('price must be a positive number'),

    body('stock')
    .isInt({min:0})
    .withMessage('stock can not be a negative number')

]

export const retrieveProductValidator = [ // use this whenever i get product with id
    param('productId')
    .isInt({gt:0})
    .withMessage('id has to be a positive number')
]

