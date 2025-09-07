import request from "supertest"
import app from '../app'
import prisma from "../shared/prisma"
import { uploadProductImage } from "../utils/uploadImage"

jest.mock('../utils/uploadImage', () => ({
    uploadProductImage: jest.fn().mockResolvedValue('http://test/url.jpg')
}))


let adminToken: string

beforeAll(async () => {
    
    const adminLogin = await request(app).post('/user/login')
        .send({ username: 'admin', password: 'password' })
    adminToken = adminLogin.body.token
})

describe('GET /product/all', () => {
    it('should return all products with 200 status', async () => {
        const res = await request(app).get('/product/all')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})

describe('POST /product/create', () => {
  it('should create a product and return 201', async () => {
    const res = await request(app)
      .post('/product/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product',
        category: 'Test Category',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'product created!');
    expect(uploadProductImage).toHaveBeenCalled(); // ensure mock was used
  });
});


describe('GET /product/:id', () => {
    it('should return a product by id', async () => {
        
        const product = await prisma.product.findFirst({
            where: { name: 'shirt' }
        })
        if(product == null) throw new Error("no product to test with")
        const res = await request(app).get(`/product/id/${product.id}`)
        expect(res.status).toBe(200)
        expect(res.body.name).toBe('shirt')
    })
})

describe('PATCH /product/update/:id', () => {
    it('should update a product', async () => {
        
        const product = await prisma.product.create({
            data: {
                name: 'UpdateMe',
                category: 'Test',
                picture: 'http://test/url.jpg',
                description: 'desc',
                price: 10,
                stock: 5
            }
        })
        const res = await request(app)
            .patch(`/product/update/${product.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated', category: 'NewCat', picture: 'http://test/url.jpg', description: 'new', price: 20, stock: 10 })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message')
    })
})

describe('DELETE /product/delete/:id', () => {
    it('should delete a product', async () => {
        
        const product = await prisma.product.create({
            data: {
                name: 'DeleteMe',
                category: 'Test',
                picture: 'http://test/url.jpg',
                description: 'desc',
                price: 10,
                stock: 5
            }
        })
        const res = await request(app)
            .delete(`/product/remove/${product.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(204)
    })
})



describe('GET /product/top', () => {
    it('should return top selling products', async () => {
        const res = await request(app)
            .get('/product/top')
            .set('Authorization', `Bearer ${adminToken}`)
            .query({ limit: 3 })
            
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})