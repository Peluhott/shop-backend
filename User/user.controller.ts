import { Request, Response } from 'express'
import * as userService from './user.service'

export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body
    try {
        const token = await userService.loginUserService(username, password)
        return res.status(200).json({ token })
    } catch (error: any) {
        return res.status(401).json({ message: error.message })
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const { name, username, password } = req.body
        await userService.createUserService(name, username, password)
        res.status(201).json({ message: 'user created successfuly' })
    } catch (error) {
        console.error("Error creating user:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function returnUserInfo(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
        console.log('didnt find a user')
        return res.status(404).json({ message: 'user id does not exist' })
    }
    try {
        const info = await userService.getUserInfoService(req.user.id)
        if (!info) {
            return res.status(404).json({ message: 'info not found for user' })
        }
        return res.status(200).json(info)
    } catch (error) {
        console.log('failed to retrieve info', error)
        return res.status(500).json({ message: 'failed to retrieve info' })
    }
}
// form for user information



//return user information


