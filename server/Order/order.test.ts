import request from "supertest"
import app from '../app'
import prisma from "../shared/prisma"

let adminToken: string
let userToken: string
let filledOrderId: number
let unfilledOrderId: number

beforeAll(async () => {
    
    const adminLogin = await request(app).post('/user/login')
        .send({ username: 'admin', password: 'password' })
    adminToken = adminLogin.body.token

   
    const userLogin = await request(app).post('/user/login')
        .send({ username: 'guest', password: 'password' })
    userToken = userLogin.body.token

    
    const filledOrder = await prisma.order.create({
        data: {
            user_id: 2, 
            total: 100,
            filled: true
            
        }
    })
    filledOrderId = filledOrder.id

    
    const unfilledOrder = await prisma.order.create({
        data: {
            user_id: 2, 
            total: 50,
            filled: false
            
        }
    })
    unfilledOrderId = unfilledOrder.id
})

describe('GET /order/user', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/order/user')
        expect(res.status).toBe(401)
    })

    it('should return 200 and user orders if authenticated', async () => {
        const res = await request(app)
            .get('/order/user')
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})

describe('GET /order/all', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/order/all')
        expect(res.status).toBe(401)
    })

    it('should return 403 if not admin', async () => {
        const res = await request(app)
            .get('/order/all')
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(403)
    })

    it('should return 200 and all orders if admin', async () => {
        const res = await request(app)
            .get('/order/all')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})

describe('GET /order/unfilled', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/order/unfilled')
        expect(res.status).toBe(401)
    })

    it('should return 403 if not admin', async () => {
        const res = await request(app)
            .get('/order/unfilled')
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(403)
    })

    it('should return 200 and unfilled orders if admin', async () => {
        const res = await request(app)
            .get('/order/unfilled')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})

describe('GET /order/filled', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/order/filled')
        expect(res.status).toBe(401)
    })

    it('should return 403 if not admin', async () => {
        const res = await request(app)
            .get('/order/filled')
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(403)
    })

    it('should return 200 and filled orders if admin', async () => {
        const res = await request(app)
            .get('/order/filled')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})

describe('POST /order/markFilledOrUnfilled/:id', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).patch('/order/markFilledOrUnfilled/1')
        expect(res.status).toBe(401)
    })

    it('should return 403 if not admin', async () => {
        const res = await request(app)
            .patch('/order/markFilledOrUnfilled/1')
            .set('Authorization', `Bearer ${userToken}`)
        expect(res.status).toBe(403)
    })

    it('should return 204 if admin and order exists', async () => {
        
        const res = await request(app)
            .patch('/order/markFilledOrUnfilled/1')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(204)
    })

    it('should mark an unfilled order as filled', async () => {
        const res = await request(app)
            .patch(`/order/markFilledOrUnfilled/${unfilledOrderId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(204)

        const updated = await prisma.order.findUnique({ where: { id: unfilledOrderId } })
        expect(updated!.filled).toBe(true)
    })

    it('should mark a filled order as unfilled', async () => {
        const res = await request(app)
            .patch(`/order/markFilledOrUnfilled/${filledOrderId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(204)

        const updated = await prisma.order.findUnique({ where: { id: filledOrderId } })
        expect(updated!.filled).toBe(false)
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})
