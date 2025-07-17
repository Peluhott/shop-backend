import bcrypt from 'bcrypt'
import * as userQueries from './user.repository'
import jwt from 'jsonwebtoken'

export async function loginUser(login: any) {
   const {username, password} = login
    const user = await userQueries.getUserByUsername(username);
    if(!user){
        throw new Error('user not found')
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('wrong password')
    }

    const payload = {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });

    return token
}