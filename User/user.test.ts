import request from "supertest"
import app from '../app'
import prisma from "../shared/prisma"

describe('GET /user/info', () => {
    it('returns 401 if not authenticated', async () => {
        const res = await request(app).get('/user/info')
        expect(res.status).toBe(401)
    })
})
afterAll(async () => {
    await prisma.$disconnect();   
                 
  })
  