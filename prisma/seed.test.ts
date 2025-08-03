import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";




const prisma = new PrismaClient();

async function main() {
    await Promise.all(
        Array.from({length:30}).map( async () => {
        try {
            const product = await prisma.product.create({
                data: {
                    name: faker.commerce.productName(),
                    category:faker.commerce.department(),
                    picture: 'wwww.pricture.com',
                    description:faker.commerce.productDescription(),
                    price:faker.number.int({min:1, max: 150}),
                    stock:faker.number.int({min:1, max: 100})
                }
            });
            console.log(product.name)
        } catch (error: any) {
            console.log('didnt make product because of',error.message || error)
        }
})
    )
    
    
    
    await Promise.all(
        Array.from({length:10}).map( async () => {
            try {
                const user = await prisma.user.create({
                    data: {
                        username:faker.internet.username(),
                        password:'password',
                        is_admin: false
                    }
                });
            await prisma.cart.create({
                data: {user_id: user.id}
            })
            } catch (error: any) {
                console.log("didn't create user because ", error.message || error)
            }

})
    )

    try {
        const products = await prisma.product.findMany();
        const carts = await prisma.cart.findMany();

        for(const cart of carts){
           await Promise.all(
            Array.from({length:3}).map(async () => {
                try {
                    const product = faker.helpers.arrayElement(products)
                    await prisma.cartItem.create({
                        data: {cart_id:cart.id,
                            product_id:product.id,
                            quantity:faker.number.int({min:1, max: 3}),
                            unitprice:product.price,

                        }
                    })
                } catch (error: any) {
                    console.log('couldnt add cart item because', error.message || error)
                }
            })
           )
        }
    } catch (error: any) {
        console.log('couldnt do anything to cart because',error.message || error)
    }

    try {
        const users = await prisma.user.findMany()

        for(const user of users){
            try {
                const cart = await prisma.cart.findFirst({
                    where:{user_id:user.id}
                })
                if(!cart){
                    console.log('no cart for this user')
                    continue;
                } else {
                    const cartItems = await prisma.cartItem.findMany({
                        where: {cart_id:cart.id}
                    })
                    const cartTotal = cartItems.reduce((sum,item) => {
                        return sum + item.quantity * item.unitprice
                    },0);
                    const order = await prisma.order.create({
                        data: {
                            user_id:user.id,
                            total:  cartTotal,
                            filled: false,

                        }
                    })
                    
                    if(!order){throw new Error('no order found');}
                    await Promise.all(cartItems.map(item =>
                        prisma.ordered_Products.create({
                          data: {
                            order_id: order.id,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            unit_price: item.unitprice
                          }
                        })
                      ));
                }

            } catch (error: any) {
                console.log('couldnt find cart for user', error.message || error)
            }
        }
    } catch (error) {
        
    }
     await prisma.user.create({
        data: {
            username: 'admin',
            password: 'password',
            is_admin: true
        }
    })

    const testUser = await prisma.user.create({
        data: {
            username: 'guest',
            password: 'password',
            is_admin: false
        }
    })

    const testCart = await prisma.cart.create({
        data: {
            user_id: testUser.id
        }
    })
    const testProduct1 = await prisma.product.create({
        data: {
            name: 'shirt',
            category: 'clothes',
            picture: 'www.pictureurl.com', // fill this in with cloudinary picture url
            description: ' a green shirt to wear',
            price: 30,
            stock: 4

        }
    })
    const testProduct2 = await prisma.product.create({
        data: {
            name: 'pant',
            category: 'clothes',
            picture: 'www.pictureurl.com', // fill this in with cloudinary picture url
            description: ' a green pair of pants to wear',
            price: 20,
            stock: 7

        }
    })
    const testProduct3 = await prisma.product.create({
        data: {
            name: 'tie',
            category: 'clothes',
            picture: 'www.pictureurl.com', // fill this in with cloudinary picture url
            description: ' a green tie to wear',
            price: 340,
            stock: 40

        }
    })
}

    
main()
  .then(() => {
    console.log("Database seeded!");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Seeding failed:", e);
    return prisma.$disconnect();
  });

