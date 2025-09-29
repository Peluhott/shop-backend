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

import { Prisma } from '@prisma/client'

export async function createUser(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body
    await userService.createUserService(email, username, password)
    return res.status(201).json({ message: 'user created successfuly' })
  } catch (error: any) {
    // Unique violation from Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      
      return res.status(400).json({ message: 'username already exists' })
    }
    console.error('Error creating user:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}


export async function returnUserInfo(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
        console.log('didnt find a user')
        return res.status(401).json({ message: 'user id does not exist' })
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

export async function returnUserInfoById(req: Request, res: Response) {
    const userId = req.params.id ? parseInt(req.params.id, 10) : undefined;
    if (!userId) {
        return res.status(400).json({ message: 'user id param required' });
    }
    try {
        const info = await userService.getUserInfoService(userId);
        if (!info) {
            return res.status(404).json({ message: 'info not found for user' });
        }
        return res.status(200).json(info);
    } catch (error) {
        console.log('failed to retrieve info', error);
        return res.status(500).json({ message: 'failed to retrieve info' });
    }
}

export async function upsertUserInfo(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        const info = await userService.upsertUserInfoService(req.user.id, req.body)
        return res.status(200).json(info)
    } catch (error) {
        console.error('Error upserting user info:', error)
        return res.status(500).json({ message: 'Failed to update user info' })
    }
}

export async function userInfoExists(req: Request, res: Response) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        const exists = await userService.userInfoExistsService(req.user.id)
        return res.status(200).json({ exists })
    } catch (error) {
        console.error('Error checking user info:', error)
        return res.status(500).json({ message: 'Failed to check user info' })
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
        const users = await userService.getAllUsersService(page, limit)
        return res.status(200).json(users)
    } catch (error) {
        console.error('Error retrieving users:', error)
        return res.status(500).json({ message: 'Failed to retrieve users' })
    }
}


