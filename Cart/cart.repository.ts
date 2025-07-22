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

export async function addItemToCart(cartId: number, productId: number, quantity: number, unitprice: number){
    await prisma.cartItem.create({
        data: {
            cart_id: cartId,
            product_id: productId,
            quantity: quantity,
            unitprice: unitprice
            
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

export async function increaseCartItemStock(cartItem_id: number,change: number) {
    await prisma.cartItem.update({
        where:{id:cartItem_id},
        data: {quantity:change}
    })
}

export async function decreaseCartItemStock(cartItem_id: number, change: number){
    await prisma.cartItem.update({
        where:{id:cartItem_id},
        data: {quantity:change}
    })
}

export async function getCartTotal(cartID: number) {
    const items = await prisma.cartItem.findMany({
        where: {cart_id:cartID
        }
    })

    if(!items){
        return 0;
    }
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitprice, 0);
    return subtotal;
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