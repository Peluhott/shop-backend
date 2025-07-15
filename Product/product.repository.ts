import prisma from '../shared/prisma'

export async function createProduct(name: string,category: string, picture: string, description: string, price: number, stock: number ) {
    await prisma.product.create({
        data: {
            name,
            category,
            picture,
            description,
            price,
            stock
        }
    })
}

export async function getProductById(id : number) {
    return await prisma.product.findFirst({
        where: {id}
    })
}

export async function getAllProducts() {
    return await prisma.product.findMany()
}

export async function updateProduct(params:type) {
    // figure this out later
}

export async function deleteProduct(id: number) {
    await prisma.product.delete({
        where: {id}
    });
}

export async function searchProductByName(name: string) {
    return prisma.product.findMany({
        where: {name}
    });
}

export async function decreaseStock(id: number, change: number) {
    await prisma.product.update({
        where: {id},
        data: {stock: { decrement: change}}
    })
}

export async function increaseStock(id: number, change: number) {
    await prisma.product.update({
        where: {id},
        data: {stock:{increment: change}}
    })
}

export async function isProductInStock(id: number) {
    const result = await prisma.product.findUnique({
        where: {id}
    })

    if(result !== null && result.stock > 0){
        return true;
    } else {return false;}
}

export async function getTopSellingProducts(params:type) {
    //figure this out later
}

export async function getLowStockProducts(params:type) {
    // figure this out later
}