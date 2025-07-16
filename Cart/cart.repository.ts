import prisma from '../shared/prisma'

export async function createCartForUser(userid: number) {
    await prisma.cart.create({
        data: {
            user_id: userid
        }
    })
}

export async function getCartByUser(userid: number) {
    return await prisma.cart.findUnique({
        where: {user_id: userid}
    })
}

export async function clearCart(cartId: number){
    await prisma.cartItem.deleteMany({
        where: {cart_id: cartId}
    })
}

export async function addItemToCart(cartId: number, productId: number, quantity: number){
    await prisma.cartItem.create({
        data: {
            cart_id: cartId,
            product_id: productId,
            quantity: quantity
        }
    })
}

export async function deleteItemFromCart(id: number) {
    await prisma.cartItem.delete({
        where: {id}
    })
}

export async function getCartItemsByCart(cartID: number) {
    return await prisma.cartItem.findMany({
        where: {cart_id: cartID}
    })
}

export async function getCartTotal(params:type) {
    //figure this out later might have to create function in product to return price
}

export async function isProductInCart(cartId: number, productID: number) {
    const result = await prisma.cartItem.findFirst({
        where: {
            product_id:productID,
            cart_id:cartId
        }
    })
    return !!result;
}