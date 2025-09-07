import { param} from 'express-validator'

export const markFilledOrUnfilledValidation = [
    param('id')
    .isInt({gt:0})
    .withMessage('id must be a positive number')
]