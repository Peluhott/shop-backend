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

describe('DELETE /remove', () => {
    it('should return a status of 204 for a sucessful delete', async () => {
        const login = await request(app).post('/user/login')
        .send({username: 'guest', password: 'password'})

        const token = login.body.token

        
    })
})


afterAll(async () => {
    await prisma.$disconnect();   
                 
  })
  