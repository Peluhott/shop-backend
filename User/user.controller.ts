import bcrypt from 'bcrypt'
import * as userQueries from './user.repository'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

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

export async function createUser(req: Request,res: Response) {
    try {
        const { name, username, password } = req.body as {
            name: string;
            username: string;
            password: string;
          };
          
            const hashedPassword = await bcrypt.hash(password,10)
            await userQueries.insertUser(username,hashedPassword)
            // code to create cart for the user
            res.status(201).json({message: 'user created successfuly'})
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
}

export async function returnUserInfo(req: Request, res: Response) {
    if(!req.user || !req.user.id){
        console.log('didnt find a user')
        return res.status(404).json({message:'user id does not exist'})
    }
    try {
        const info = await userQueries.getUserInfo(req.user.id)
        if(!info){
            return res.status(404).json({message:'info not found for user'})
        }
        return res.status(200).json(info)
    } catch (error) {
        console.log('failed to retrieve info',error)
        return res.status(500).json({message:'failed to retrieve info'})
    }
}
// form for user information



//return user information 


