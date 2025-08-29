import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from 'bcrypt'
import * as productQueries from '../Product/product.repository'
import * as userQueries from '../User/user.repository'
import * as orderQueries from '../Order/order.repository'
import * as cartQueries from '../Cart/cart.repository'

// learn to create seperate db one for testing and one for production 
// add code to not run this seeder is the database is set to the production one
// add better data later on


const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password',10)
    const adminEmail = 'admin@yahoo.com'
    const admin = await userQueries.insertUser('admin',hashedPassword, adminEmail)

    await prisma.user.update({
        where:{id:admin.id},
        data: {is_admin: true}
    })
    

    const testUser = await userQueries.insertUser("guest",hashedPassword,'guest@yahoo.com');
    await prisma.order.create({
        data: {
            user_id:2,
            total: 200,
            filled: false

        }
    })

    
    const products = [
  // ----- T-SHIRTS -----
  {
    name: 'Teal T-shirt',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125992/teal-t-shirt_ehayuq.jpg',
    description: 'A teal t-shirt to wear casually or at the gym.',
    price: 25,
    stock: 10,
  },
  {
    name: 'Red T-shirt',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125985/red-t-shirt_j7kzms.jpg',
    description: 'A bold red t-shirt, lightweight and breathable.',
    price: 25,
    stock: 12,
  },
  {
    name: 'Purple T-shirt',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125984/purple-t-shirt_ongaoa.jpg',
    description: 'A stylish purple t-shirt for casual wear.',
    price: 25,
    stock: 8,
  },
  {
    name: 'Blue T-shirt',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125983/blue-t-shirt_ywueka.jpg',
    description: 'Classic blue t-shirt, perfect for everyday use.',
    price: 25,
    stock: 15,
  },
  {
    name: 'Cobalt T-shirt',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125982/cobalt-blue-t-shirt_vxfqoh.jpg',
    description: 'Cobalt blue t-shirt, modern and comfortable.',
    price: 25,
    stock: 11,
  },
  {
    name: 'Green T-shirt',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125982/green-t-shirt_mvtv3w.jpg',
    description: 'A green t-shirt for casual style.',
    price: 25,
    stock: 9,
  },
  {
    name: 'Grey T-shirt',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125982/grey-t-shirt_zilyju.jpg',
    description: 'Neutral grey t-shirt that matches any outfit.',
    price: 25,
    stock: 14,
  },

  // ----- SHORTS -----
  {
    name: 'Blue Shorts',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125991/short5_p62sco.jpg',
    description: 'Blue shorts for comfort and active wear.',
    price: 30,
    stock: 20,
  },
  {
    name: 'Aqua Shorts',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125991/short6_bnwn5c.jpg',
    description: 'Aqua shorts, lightweight and breathable.',
    price: 30,
    stock: 18,
  },
  {
    name: 'Black Gym Shorts',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125991/short3_vzrjbt.avif',
    description: 'Durable black gym shorts, made for workouts.',
    price: 28,
    stock: 22,
  },
  {
    name: 'Jean Short Shorts',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125991/short4_ni3orm.webp',
    description: 'Jean short shorts for a casual summer look.',
    price: 32,
    stock: 15,
  },
  {
    name: 'Black Tennis Shorts',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125988/short1_x4nl01.webp',
    description: 'Black tennis shorts for sports and active use.',
    price: 29,
    stock: 18,
  },
  {
    name: 'Bright Blue Athletic Shorts',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125988/short2_blyurb.webp',
    description: 'Bright blue shorts designed for athletics.',
    price: 29,
    stock: 20,
  },

  // ----- SHOES -----
  {
    name: 'Black and White Shoes',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125987/shoes6_rwlcbe.webp',
    description: 'Casual black and white shoes for daily wear.',
    price: 60,
    stock: 16,
  },
  {
    name: 'White Shoes',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125987/shoes5_hxhfap.webp',
    description: 'Classic white shoes, clean and stylish.',
    price: 55,
    stock: 14,
  },
  {
    name: 'Grey Shoes',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125987/shoes3_c4uy5s.webp',
    description: 'Versatile grey shoes that fit any outfit.',
    price: 58,
    stock: 12,
  },
  {
    name: 'Blue Dress Shoes',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125987/shoes2_ls2r6f.webp',
    description: 'Polished blue dress shoes for formal occasions.',
    price: 80,
    stock: 9,
  },
  {
    name: 'Black Dress Shoes',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125987/shoes4_iz2gq9.webp',
    description: 'Classic black dress shoes for professional style.',
    price: 85,
    stock: 10,
  },
  {
    name: 'Blue Brown Shoes',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125987/shoes1_sa8w5l.jpg',
    description: 'Unique blue and brown shoes with modern design.',
    price: 75,
    stock: 11,
  },

  // ----- PANTS -----
  {
    name: 'Black Pants',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125985/pants2_dlpkbx.webp',
    description: 'Classic black pants for casual or formal wear.',
    price: 40,
    stock: 13,
  },
  {
    name: 'Orange Joggers',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125984/pants6_zrm8oj.webp',
    description: 'Comfortable orange joggers for lounging or workouts.',
    price: 38,
    stock: 15,
  },
  {
    name: 'Black Jeans',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125984/pants4_vrlr9k.webp',
    description: 'Stylish black jeans with a slim fit.',
    price: 45,
    stock: 12,
  },
  {
    name: 'Bright Blue Pants',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125984/pants5_z7lkki.webp',
    description: 'Eye-catching bright blue pants for bold style.',
    price: 42,
    stock: 10,
  },
  {
    name: 'Blue Pants',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125984/pants3_uw2bmx.webp',
    description: 'Classic blue pants suitable for any occasion.',
    price: 40,
    stock: 14,
  },
  {
    name: 'Slim Black Pants',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125983/pants1_l9c4qs.webp',
    description: 'Slim fit black pants with a modern cut.',
    price: 45,
    stock: 11,
  },

  // ----- HATS -----
  {
    name: 'Black Cap',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125983/hat5_fn5h5y.jpg',
    description: 'Simple black cap for everyday wear.',
    price: 20,
    stock: 18,
  },
  {
    name: 'Black Dad Hat',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125983/hat4_cmvna8.jpg',
    description: 'Casual black dad hat, adjustable fit.',
    price: 22,
    stock: 20,
  },
  {
    name: 'Black Fedora',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125983/hat3_hehw7j.jpg',
    description: 'Black fedora hat for a classy touch.',
    price: 28,
    stock: 8,
  },
  {
    name: 'Brown Hat',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125983/hat1_br2u6r.webp',
    description: 'A brown hat with a rustic vibe.',
    price: 24,
    stock: 14,
  },
  {
    name: 'White Hat',
    category: 'clothes',
    picture: 'https://res.cloudinary.com/dosgn4aqb/image/upload/v1756125983/hat2_oqdnhs.webp',
    description: 'Clean white hat, stylish and fresh.',
    price: 22,
    stock: 15,
  },
]

// Bulk insert
await Promise.all(
  products.map(async (p) => {
    try {
      const product = await prisma.product.create({ data: p })
      console.log(`Created: ${product.name}`)
    } catch (error: any) {
      console.log(`Couldn’t create ${p.name}:`, error.message || error)
    }
  })
)

    
    
    
    await Promise.all(
        Array.from({length:10}).map( async () => {
            const username = faker.internet.username()
            const email = faker.internet.email()
            try {
                const user = await userQueries.insertUser(username, hashedPassword,email)
            // add user info for each
            }
             catch (error: any) {
                console.log(`didn't create ${username} because `, error.message || error)
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

