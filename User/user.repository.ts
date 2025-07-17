import prisma from '../shared/prisma'

export async function insertUser(name: string, username: string, password: string,) {
    await prisma.user.create({
        data: {
            username,
            password,
            is_admin: false,
            information: {}
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

export async function updateUserInformation(params:type) {
    // figure this one out later
}

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