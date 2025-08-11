import request from "supertest"
import app from '../app'
import prisma from "../shared/prisma"
// create test for getting orders by user

describe('GET /order/user', () => {
    it('should return 200 status for order by a user', async () => {
        const login = await request(app).post('/user/login')
        .send({username:'guest', password:'password'})

        const token = login.body.token

        const res = await request(app).get('/order/user')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
    })
})

describe('GET /order/all', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/order/all')
        expect(res.status).toBe(401)
    })

    it('should return status 403 because not admin', async () => {
        const login = await request(app).post('/user/login')
        .send({username: 'guest', password:'password'})
        
        const token = login.body.token;

        const res = await request(app).get('/order/all')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(403);
    })

    it('should return 200 for valid login and admin status', async () => {
        const login = await request(app).post('/user/login')
        .send({username:'admin', password:'password'})

        const token = login.body.token

        const res = await request(app).get('/order/all')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
    })
})

describe('GET /order/unfilled', () => {
    it('should return 200 for unfilled orders', async () => {
        const login = await request(app).post('/user/login')
        .send({username:'admin', password:'password'})

        const token = login.body.token

        const res = await request(app).get('/order/unfilled')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)

        if(res.body.length > 0){
            expect(res.body[0].filled).toBe(false)
        }

        
    })
})

describe('GET /order/filled', () => {
    it('should return 200 for filled orders', async () => {

        await prisma.order.update({ // find a better way to do this
            where: {id: 1},
            data: {filled:true}
        })
        const login = await request(app).post('/user/login')
        .send({username:'admin', password:'password'})

        const token = login.body.token

        const res = await request(app).get('/order/filled')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)

        if(res.body.length > 0){
            expect(res.body[0].filled).toBe(true)
        }

        
    })
}) 

describe('POST /order/markFilledOrUnfilled', () => {
    it('should check whether a order is filled or unfilled and mark it the opposite', async () => {
        const login = await request(app).post('/user/login')
        .send({username:"admin", password:"password"})

        const token = login.body.token

        const order = await prisma.order.findFirst({
            where:{id: 1}
        })
        const firstStatus = order?.filled

        await request(app).patch('/order/mark/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

        const orderAfter = await prisma.order.findFirst({
            where:{id: 1}
        })

        const secondStatus = orderAfter?.filled

        expect(firstStatus).toBe(!secondStatus)
    
        
    })
})

afterAll(async () => {
    await prisma.$disconnect();   
                 
  })
  