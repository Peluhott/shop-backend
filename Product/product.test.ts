import request from "supertest"
import app from '../app'



jest.mock('../utils/uploadImage', () => ({
    uploadProductImage: jest.fn().mockResolvedValue('http.//test/url.jpg')
}))
import { uploadProductImage } from "../utils/uploadImage";
const mockUpload = uploadProductImage as jest.MockedFunction<typeof uploadProductImage>; // to use for counts or errors

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

describe('POST /product/create', () => {
    it('should return a 401', async () => {
        const res = await request(app).post('/product/create');
        expect(res.status).toBe(401)
    })

    it('should return 403 because logged in but not admin', async () => {
        const login = await request(app)
        .post('/user/login')
        .send({username: 'guest', password: 'password'})

        const token = login.body.token;
        //name , category, description, price, stock
        const res = await request(app)
        .post('/product/create')
        .set('Authorization', `Bearer ${token}`)
        .send({name:'model1', category:'shirt', description: 'a new green shirt', price: 40, stock: 10})

        expect(res.status).toBe(403);
    })

    it('should return 201 because its admin and logged in, with valid form data(image mocked)', async () => {
        
        const login = await request(app)
        .post('/user/login')
        .send({username: 'admin', password: 'password'})

        const token = login.body.token;
        //name , category, description, price, stock
        const res = await request(app)
        .post('/product/create')
        .set('Authorization', `Bearer ${token}`)
        .send({name:'model1', category:'shirt', description: 'a new green shirt', price: 40.00, stock: 10})

        expect(res.status).toBe(201);
    })
})

