import { describe, test, expect, vi } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { prisma } from '../lib/prisma.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockResolvedValue(true),
  },
}))

describe('Auth Endpoints', () => {
  // POST /api/auth/register
  test('POST /api/auth/register - should create a new user', async () => {
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 1,
      name: 'Brian',
      email: 'brian@gmail.com',
      password: 'hashed_password',
    })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Brian', email: 'brian@gmail.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data).not.toHaveProperty('password')
  })

  // POST /api/auth/login
  test('POST /api/auth/login - should return a token', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 1,
      name: 'Brian',
      email: 'brian@gmail.com',
      password: 'hashed_password',
    })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'brian@gmail.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })
})
