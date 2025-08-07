import prisma from '../shared/prisma'
import { UserInfoUpdate } from '../types/user.types';

export async function insertUser(username: string, password: string,) { // change this to transaction to also create a userinfo row in table
    return await prisma.user.create({ // took out name from arguments
        data: {
            
            username,
            password,
            is_admin: false
            
        }
    });
}

export async function getUserById(id : number) {
    return await prisma.user.findUnique({
        where: {id}
    });
}

export async function getUserByUsername(username:string) {
    return await prisma.user.findUnique({
        where: {username}
    });
}

//export async function updateUserInformation(params:type) {
    // figure this one out later
//}

export async function deleteUser(id: number) {
    await prisma.user.delete({
        where: {id}
    })
}

export async function isUsernameTaken(username: string) {
    const user = await prisma.user.findUnique({
        where: {username}
    });
    return !!user
}

export async function getAllUsers() {
    const results = await prisma.user.findMany()
    return results;
}

export async function promoteUser(id: number) {
    await prisma.user.update({
        where:{id},
        data: {is_admin : true}
    });
}

export async function getUserInfo(id: number){
    return await prisma.userInfo.findUnique({ // might return null in some fields
        where:{userId:id} 
    })
}

export async function updateUserInfo(userid: number, email: string, data: Partial<Omit<UserInfoUpdate, 'email'>>){
    await prisma.userInfo.update({
        where:{userId:userid},
        data: {
            email,
            ...(data.address && {phone: data.address}),
            ...(data.city && {city: data.city}),
            ...(data.state && {state: data.state}),
            ...(data.country && {state: data.country}),
            ...(data.age !== undefined && {age: data.age}),
            ...(data.gender && {gender: data.gender})
        }

    });
}