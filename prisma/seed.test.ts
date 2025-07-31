import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";




const prisma = new PrismaClient();

async function main() {
     await Promise.all(
        Array.from({length:2}).map( async () => {
            const user = await prisma.user.create({
                data: {
                    username:faker.internet.username(),
                    password:'password',
                    is_admin: false
                }
            });
        console.log(user.username)

})
    )

     await Promise.all(
        Array.from({length:30}).map( async () => {
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
})
    )
    
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

