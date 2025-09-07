import { param, body } from 'express-validator'

export const removeItemValidation = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage('id must be positive number')
]

export const addItemToCartValidation = [
    body('productId')
        .isInt({ gt: 0 })
        .withMessage('productId must be a positive number'),

    body('quantity')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('quantity must be greater than 0'),

    body('unitPrice')
        .isFloat({ gt: 0 })
        .withMessage('unitPrice must be greater than 0')
]

export const changeQuantityValidation = [
    param('productId')
        .isInt({ gt: 0 })
        .withMessage('productId must be positive'),

    body('quantity')
        .isInt({ gt: 0 })
        .withMessage('quantity must be greater than 0')
]

export const placeOrderValidation = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('items array cannot be empty'),

    body('items.*.productId')
        .isInt({ gt: 0 })
        .withMessage('productId must be positive'),

    body('items.*.qty')
        .isInt({ gt: 0 })
        .withMessage('qty must be greater than 0'),

    body('items.*.unitPrice')
        .isFloat({ gt: 0 })
        .withMessage('unitPrice must be greater than 0'),

    body('orderTotal')
        .isFloat({ gt: 0 })
        .withMessage('orderTotal must be positive')
]

