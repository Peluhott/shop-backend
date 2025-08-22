import prisma from '../shared/prisma'
import { UserInfoUpdate } from '../types/user.types';

// Transaction: create user and userInfo together
export async function insertUser(username: string, password: string) {
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
                email: '', // Set default or require email in args
            }
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
    email: string,
    data: Partial<Omit<UserInfoUpdate, 'email'>>
) {
    return await prisma.userInfo.update({
        where: { userId: userid },
        data: {
            email,
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