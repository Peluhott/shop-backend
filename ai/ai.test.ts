import request from 'supertest'
import app from '../app'
import prisma from '../shared/prisma'

let adminToken: string
let userToken: string

beforeAll(async () => {
  // assume users already exist: admin/password and guest/password
  const adminLogin = await request(app).post('/user/login').send({ username: 'admin', password: 'password' })
  adminToken = adminLogin.body.token

  const userLogin = await request(app).post('/user/login').send({ username: 'guest', password: 'password' })
  userToken = userLogin.body.token
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('POST /ai/message (real route)', () => {
  it('returns 401 if not authenticated', async () => {
    const res = await request(app).post('/ai/message').send({ message: 'can you give me a list of all the users' })
    expect(res.status).toBe(401)
  })

  it('returns 403 for non-admin users', async () => {
    const res = await request(app)
      .post('/ai/message')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ message: 'can you give me a list of all the users' })

    expect(res.status).toBe(403)
  })

  it('allows admin and returns JSON (may include function_call or modelOutput)', async () => {
    const res = await request(app)
      .post('/ai/message')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ message: 'can you give me a list of all the users' })
    console.log(res)
    expect(res.status).toBe(200)
    
    
  })
})