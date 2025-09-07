import request from 'supertest'
import app from '../../app'
import prisma from '../shared/prisma'
import bcrypt from 'bcrypt'


let userToken: string

beforeAll(async () => {
  
  await prisma.user.deleteMany({ where: { username: 'newuser' } })

  
  const guest = await prisma.user.upsert({
    where: { username: 'guest' },
    update: {},
    create: {
      username: 'guest',
      password: await bcrypt.hash('password', 10),
      is_admin: false,
    },
    select: { id: true },
  })

  // Ensure guest has userInfo (idempotent)
  await prisma.userInfo.upsert({
    where: { userId: guest.id },
    update: {
      email: 'guest@example.com',
      address: '123 Test St',
      city: 'Greensboro',
      state: 'NC',
      zipcode: '27401',
      country: 'USA',
      age: 21,
      gender: 'Other',
    },
    create: {
      userId: guest.id,
      email: 'guest@example.com',
      address: '123 Test St',
      city: 'Greensboro',
      state: 'NC',
      zipcode: '27401',
      country: 'USA',
      age: 21,
      gender: 'Other',
    },
  })

  
  const login = await request(app).post('/user/login')
    .send({ username: 'guest', password: 'password' })
  userToken = login.body.token
})

describe('POST /user/login', () => {
  it('should return a token for valid credentials', async () => {
    const res = await request(app).post('/user/login')
      .send({ username: 'guest', password: 'password' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app).post('/user/login')
      .send({ username: 'guest', password: 'wrongpassword' })
    expect(res.status).toBe(401)
  })
})

describe('GET /user/info', () => {
  it('returns 401 if not authenticated', async () => {
    const res = await request(app).get('/user/info')
    expect(res.status).toBe(401)
  })

  it('returns user info if authenticated', async () => {
    const res = await request(app).get('/user/info')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('email')
  })
})

describe('POST /user/create', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/user/create')
      .send({ email: 'Test@example.com', username: 'newuser', password: 'newpass' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('message')
  })

  it('should not create user with existing username', async () => {
    const res = await request(app).post('/user/create')
      .send({ email: 'Test@example.com', username: 'guest', password: 'password' })
    expect(res.status).toBe(400)
  })
})

describe('POST /user/info/upsert', () => {
  it('should create user info if it does not exist', async () => {
    const res = await request(app)
      .post('/user/info/upsert')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'guest@example.com',
        address: '123 Main St',
        city: 'Testville',
        state: 'TS',
        country: 'Testland',
        zipcode: '12345',
        age: 25,
        gender: 'other'
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('email', 'guest@example.com')
  })

  it('should update user info if it already exists', async () => {
    await request(app)
      .post('/user/info/upsert')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'guest@example.com',
        address: '123 Main St',
        city: 'Testville',
        state: 'TS',
        country: 'Testland',
        zipcode: '12345',
        age: 25,
        gender: 'other'
      })

    const res = await request(app)
      .post('/user/info/upsert')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'updated@example.com',
        address: '456 New St',
        city: 'Newville',
        state: 'NS',
        country: 'Newland',
        zipcode: '67890',
        age: 30,
        gender: 'female'
      })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('email', 'updated@example.com')
    expect(res.body).toHaveProperty('address', '456 New St')
  })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { username: 'newuser' } })
  await prisma.$disconnect()
})
