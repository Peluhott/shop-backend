import { body, param, query } from 'express-validator'

export const productInfoValidation = [
    body('name')
        .isString().withMessage('name must be a string')
        .notEmpty().withMessage('name cannot be empty')
        .isLength({ min: 2, max: 100 }).withMessage('name must be between 2-100 characters')
        .trim(),

    body('category')
        .isString().withMessage('category must be a string')
        .notEmpty().withMessage('category cannot be empty')
        .isLength({ min: 2, max: 100 }).withMessage('category must be between 2-100 characters')
        .trim(),

    body('description')
        .isString().withMessage('description must be a string')
        .notEmpty().withMessage('description cannot be empty')
        .isLength({ min: 2, max: 500 }).withMessage('description must be between 2-500 characters')
        .trim(),

    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price must be a positive number'),

    body('stock')
        .isInt({ min: 0 })
        .withMessage('stock cannot be negative')
]

export const retrieveProductValidator = [
    param('productId')
        .isInt({ gt: 0 })
        .withMessage('productId must be a positive number')
]

// For PATCH update, allow partial updates but validate types if present
export const updateProductValidation = [
    body('name')
        .optional()
        .isString().withMessage('name must be a string')
        .isLength({ min: 2, max: 100 }).withMessage('name must be between 2-100 characters')
        .trim(),

    body('category')
        .optional()
        .isString().withMessage('category must be a string')
        .isLength({ min: 2, max: 100 }).withMessage('category must be between 2-100 characters')
        .trim(),

    body('description')
        .optional()
        .isString().withMessage('description must be a string')
        .isLength({ min: 2, max: 500 }).withMessage('description must be between 2-500 characters')
        .trim(),

    body('price')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('price must be a positive number'),

    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('stock cannot be negative')
]

// For /filter route: expects ?filter=field&value=...
export const filterProductValidator = [
    query('filter')
        .isString().withMessage('filter must be a string')
        .notEmpty().withMessage('filter cannot be empty')
        .isIn(['name', 'category', 'price', 'stock']).withMessage('invalid filter field'),

    query('value')
        .notEmpty().withMessage('value cannot be empty')
]

// For /search route: expects ?search=...
export const searchProductValidator = [
    query('search')
        .isString().withMessage('search must be a string')
        .notEmpty().withMessage('search cannot be empty')
]

// For /top route: expects ?limit=...
export const topSellingProductValidator = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit must be a positive integer between 1 and 100')
]

