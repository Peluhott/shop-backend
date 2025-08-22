import bcrypt from 'bcrypt'
import * as userQueries from './user.repository'
import jwt from 'jsonwebtoken'

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

export async function createUserService(name: string, username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return await userQueries.insertUser(username, hashedPassword)
    // You can add logic to create a cart for the user here if needed
}

export async function getUserInfoService(userId: number) {
    return await userQueries.getUserInfo(userId)
}