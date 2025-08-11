import request from "supertest"
import app from '../app'
import prisma from "../shared/prisma"


describe('GET /cart', () => {
    it('should returns 401 if not authenticated', async () => {
        const res = await request(app).get('/cart')
        expect(res.status).toBe(401)
    })

    it('should return a status of 200 for the cart' , async () => {
        const login = await request(app).post('/user/login')
        .send({username: 'guest', password: 'password'})

        const token = login.body.token

        const res = await request(app).get('/cart')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
    })
})

describe('POST /add', () => {
    it('should return a status of 201 for a sucessful add', async () => {
        const login = await request(app).post('/user/login')
        .send({username: 'guest', password: 'password'})

        const token = login.body.token

        const userID = await prisma.user.findFirst({where: {username: 'guest'}})
        const cartID= await prisma.cart.findFirst({where: {user_id:userID?.id}})
        const productID = 1;

        //clear cart
        await prisma.cartItem.deleteMany({where:{cart_id:cartID?.id}})

        
        await request(app).post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({productId:productID, unitPrice:20})
        .expect(201)

        const cart = await request(app).get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

        const items = cart.body.items ?? cart.body

        
        expect(Array.isArray(items)).toBe(true);
        expect(items.some((i: any) => i.product_id === productID)).toBe(true);


        
    })
})

describe('POST /remove/:id' ,() => {
    it('should return 204 for successful deletion of product from cart', async () => {
        const login = await request(app).post('/user/login')
        .send({username: 'guest', password: 'password'})

        const token = login.body.token

        const userID = await prisma.user.findFirst({where: {username: 'guest'}})
        const cartID= await prisma.cart.findFirst({where: {user_id:userID?.id}})
        const productID = 1;

        await prisma.cartItem.deleteMany({where:{cart_id:cartID?.id}})

        await prisma.cartItem.create({
            data: {
                cart_id: cartID!.id,
                product_id: productID,
                unitprice: 10
            }
        })

        
        const res = await request(app).delete(`/cart/remove/${productID}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(204)
    })
})


afterAll(async () => {
    await prisma.$disconnect();   
                 
  })
  