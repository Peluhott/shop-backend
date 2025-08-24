import prisma from '../shared/prisma'
import { UserInfoUpdate } from '../types/user.types';

// Transaction: create user and userInfo together
export async function insertUser(username: string, password: string, email: string) {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                username,
                password,
                is_admin: false
            }
        });
        await tx.userInfo.create({
            data: {
                userId: user.id,
                email: email
            }
        });
        await tx.cart.create({
            data: { user_id: user.id }
        });
        return user;
    });
}

export async function getUserById(id: number) {
    return await prisma.user.findUnique({
        where: { id }
    });
}

export async function getUserByUsername(username: string) {
    return await prisma.user.findUnique({
        where: { username }
    });
}

export async function deleteUser(id: number) {
    return await prisma.user.delete({
        where: { id }
    });
}

export async function isUsernameTaken(username: string) {
    const user = await prisma.user.findUnique({
        where: { username }
    });
    return !!user;
}

export async function getAllUsers() {
    return await prisma.user.findMany();
}

export async function promoteUser(id: number) {
    return await prisma.user.update({
        where: { id },
        data: { is_admin: true }
    });
}

export async function getUserInfo(id: number) {
    return await prisma.userInfo.findUnique({
        where: { userId: id }
    });
}

export async function updateUserInfo(
    userid: number,
    
    data: Partial<Omit<UserInfoUpdate ,'userId'>>
) {
    return await prisma.userInfo.update({
        where: { userId: userid },
        data: {
            ...(data.email && { email: data.email }),
            ...(data.address && { address: data.address }),
            ...(data.city && { city: data.city }),
            ...(data.state && { state: data.state }),
            ...(data.country && { country: data.country }),
            ...(data.zipcode && { zipcode: data.zipcode }),
            ...(data.age !== undefined && { age: data.age }),
            ...(data.gender && { gender: data.gender })
        }
    });
}

export async function createUserInfo(userId: number, data: Partial<UserInfoUpdate>) {
    return await prisma.userInfo.create({
        data: {
            userId,
            email: data.email ?? '',
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            zipcode: data.zipcode,
            age: data.age,
            gender: data.gender
        }
    })
}