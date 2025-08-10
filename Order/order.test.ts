import request from "supertest"
import app from '../app'
import prisma from "../shared/prisma"

describe('GET /order/all', () => {
    it('returns 401 if not authenticated', async () => {
        const res = await request(app).get('/order/all')
        expect(res.status).toBe(401)
    })

    it('returns status 403 because not admin', async () => {
        const login = await request(app).post('/user/login')
        .send({username: 'guest', password:'password'})
        
        const token = login.body.token;

        const res = await request(app).get('/order/all')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(403);
    })

    it('returns 200 for valid login and admin status', async () => {
        const login = await request(app).post('/user/login')
        .send({username:'admin', password:'password'})

        const token = login.body.token

        const res = await request(app).get('/order/all')
        .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
    })
})

describe('Get /order/unfilled', () => {
    it('returns 200 for unfilled orders', async () => {
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

describe('Get /order/filled', () => {
    it('returns 200 for filled orders', async () => {
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

afterAll(async () => {
    await prisma.$disconnect();   
                 
  })
  