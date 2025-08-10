import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from 'bcrypt'
import * as productQueries from '../Product/product.repository'
import * as userQueries from '../User/user.repository'
import * as orderQueries from '../Order/order.repository'
import * as cartQueries from '../Cart/cart.repository'

// learn to create seperate db one for testing and one for production 
// add code to not run this seeder is the database is set to the production one


const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password',10)

    const admin = await userQueries.insertUser('admin',hashedPassword)

    await prisma.user.update({
        where:{id:admin.id},
        data: {is_admin: true}
    })
    

    const testUser = await userQueries.insertUser("guest",hashedPassword);
    
    
    

    await Promise.all(
        Array.from({length:30}).map( async () => {
            const name = faker.commerce.productName();
            const category = faker.commerce.department();
            const picture = 'www.pictureurl.com'
            const description = faker.commerce.productDescription()
            const price = faker.number.int({min:1,max:150})
            const stock = faker.number.int({min:1,max:100})
        try {
            const product = await productQueries.createProduct(name, category, picture, description, price , stock)
            console.log(product.name)
        } catch (error: any) {
            console.log('didnt make product because of',error.message || error)
        }
})
    )
    
    
    
    await Promise.all(
        Array.from({length:10}).map( async () => {
            const username = faker.internet.username()
            try {
                const user = await userQueries.insertUser(username, "password")
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
            const usedProductIds = new Set();

            await Promise.all(
              Array.from({ length: 3 }).map(async () => {
                let product;
                do {
                  product = faker.helpers.arrayElement(products);
                } while (usedProductIds.has(product.id));
                
                usedProductIds.add(product.id);
                const quantity = faker.number.int({min:1, max:3})
                await cartQueries.addItemToCart(cart.id, product.id, quantity, product.price)
                
              })
            );
            
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
                    const orderedProductData = cartItems.flatMap(item =>
                        Array.from({ length: item.quantity }, () => ({
                          order_id: order.id,
                          product_id: item.product_id,
                          unit_price: item.unitprice
                        }))
                      );
                      
                      await Promise.all(
                        orderedProductData.map(data =>
                          prisma.ordered_Products.create({ data })
                        )
                      );
                }

            } catch (error: any) {
                console.log('couldnt find cart for user', error.message || error)
            }
        }
    } catch (error) {
        
    }
    

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

