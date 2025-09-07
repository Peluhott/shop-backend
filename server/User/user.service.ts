import bcrypt from 'bcrypt'
import * as userQueries from './user.repository'
import jwt from 'jsonwebtoken'
import { UserInfoUpdate } from '../types/user.types'

export async function loginUserService(username: string, password: string) {
    const user = await userQueries.getUserByUsername(username)
    if (!user) {
        throw new Error('user not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('wrong password')
    }
    const payload = {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    })
    return token
}

export async function createUserService(email: string, username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return await userQueries.insertUser(username, hashedPassword, email)
    // make sure cart and user info are created to user as well
}

export async function getUserInfoService(userId: number) {
    return await userQueries.getUserInfo(userId)
}

export async function upsertUserInfoService(userId: number, info: Partial<Omit<UserInfoUpdate, 'userId'>>) {
    const existing = await userQueries.getUserInfo(userId)
    if (existing) {
        // Update existing info
        return await userQueries.updateUserInfo(
            userId,
            info as UserInfoUpdate
        )
    } else {
        // If no info exists, update is not possible, so just return null or throw
        throw new Error('User info does not exist. User info is created during user registration.')
    }
}

export async function userInfoExistsService(userId: number) {
    const info = await userQueries.getUserInfo(userId)
    return !!info
}

export async function getAllUsersService(page?: number, limit?: number) {
    return await userQueries.getAllUsers(page, limit)
}