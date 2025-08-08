import { Prisma } from '@prisma/client'
import prisma from '../shared/prisma'

export async function createProduct(name: string,category: string, picture: string, description: string, price: number, stock: number ) {
    return await prisma.product.create({
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

export async function updateProduct(productId: number, name: string, category: string, picture: string, description: string, price: number, stock: number ) {
    await prisma.product.update({
        where:{id:productId},
        data: {
            name: name,
            category: category,
            picture:picture,
            description:description,
            price:price,
            stock:stock
        }
    })
}

export async function deleteProduct(id: number) {
    await prisma.product.delete({
        where: {id}
    });
}

export async function searchProductByName(name: string) { // don't need this
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

export async function getProductByFilter<k extends keyof Prisma.productWhereInput>(filter: k, value: Prisma.productWhereInput[k]){ // only allows filters that exist in schema
    return await prisma.product.findMany({
        where:{[filter]:value}

    })
    
}

export async function searchProductsMatching(search: string){
    return await prisma.product.findMany({
        where: {
            OR:[
                {name: {contains: search, mode: 'insensitive'}},
                {category: {contains: search, mode: 'insensitive'}},
                {description: {contains: search, mode: 'insensitive'}}
                
            ]
        }
    })
}

export async function getTopSellingProducts(limit : number) {
    const topselling = await prisma.ordered_Products.groupBy({
        by: ['product_id'],
        _count: {product_id: true},
        orderBy:{_count:{product_id:'desc'}},
        take: limit
    })

    const products = await Promise.all(topselling.map(async (entry) => {
        const product = await prisma.product.findUnique({
            where: {id: entry.product_id},
        });
        return {
            ...product, 
        totalSold: entry._count.product_id
        };
    })
);
        return products;
}

//export async function getLowStockProducts(params:type) {
    // figure this out later
//}