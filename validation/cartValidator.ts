import { param, body} from 'express-validator'

export const removeItemValidation = [
    param('id')
    .isInt({gt:0})
    .withMessage('id must be positive number')
]

export const addItemToCartValidation = [
    body('productId')
    .isInt({gt:0})
    .withMessage('id must be positive number'),

    body('quantity')
    .optional()
    .isInt({gt:0})
    .withMessage('quantity must be greater than 0'),

    body('unitPrice')
    .isInt({gt:0})
    .withMessage('price must be greater than 0')
]

export const changeQuantityValidation = [
    param('productId')
    .isInt({gt:0})
    .withMessage('product id must be postive'),

    body('quantity')
    .isInt({gt:0})
    .withMessage('quantity must be greater than 0')

]

export const placeOrderValidation = [
    body('items')
    .isArray({min:1})
    .withMessage('array can not be empty'),

    body('items.*.productId')
    .isInt({gt:0})
    .withMessage('product id must be positive'),

    body('items*.*qty')
    .isInt({gt:0})
    .withMessage('quantity must be greater than 0 '),

    body('items*.*unitprice')
    .isFloat({gt:0})
    .withMessage('price must be non-negative'),

    body('orderTotal')
    .isFloat({gt:0})
    .withMessage('must be positive')
]

