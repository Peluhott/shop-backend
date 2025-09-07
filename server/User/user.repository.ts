import prisma from '../utils/prisma'
import { UserInfoUpdate } from '../types/user.types';


export async function insertUser(
  username: string,
  password: string,
  email: string,
  info?: {
    address?: string; city?: string; state?: string; zipcode?: string; country?: string;
    age?: number; gender?: string;
  }
) {
  return prisma.user.create({
    data: {
      username,
      password,
      is_admin: false,
      // create userInfo row with email + optional fields
      userinfo: {
        create: {
          email,
          address: info?.address,
          city: info?.city,
          state: info?.state,
          zipcode: info?.zipcode,
          country: info?.country,
          age: info?.age,
          gender: info?.gender,
        },
      },
      // create the cart row linked to this user (uses cart.user_id behind the scenes)
      cart: { create: {} },
    },
    include: { userinfo: true, cart: true },
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

export async function updateUserInfo(userId: number, data: UserInfoUpdate) {
  
  return prisma.userInfo.update({
    where: { userId },
    data,
  });
}

