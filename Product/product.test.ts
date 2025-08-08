import request from "supertest"
import app from '../app'

describe('GET /product/all', () => {
    it('should return all products with 200 status', async () => {
        const res = await request(app).get('/product/all');
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)

        if(res.body.length > 0){
            expect(res.body[0]).toHaveProperty('id')
            expect(res.body[0]).toHaveProperty('name')
        }
    })
})