import {Request, Response, NextFunction} from 'express'

export function checkAdmin(req: Request, res: Response, next:NextFunction){
    if(req.user && req.user.is_admin == true){
        return next()
    }
    return res.status(403).json({message: 'access denied, admins only'})
}