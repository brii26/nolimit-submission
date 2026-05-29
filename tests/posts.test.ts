import { describe, test, expect, vi } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { prisma } from '../lib/prisma.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('../middleware/auth.js', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.user = { userId: 42, email: 'brian@gmail.com' }
    next()
  },
}))

vi.mock('../middleware/isAuthor.js', () => ({
  validateAuthor: (_req: any, _res: any, next: any) => {
    next()
  },
}))

describe('Posts Endpoints', () => {
  // GET /api/posts
  test('GET /api/posts - should return all posts', async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([
      { id: 1, content: 'Post 1', authorId: 42, createdAt: new Date(), updatedAt: new Date() },
    ])

    const res = await request(app).get('/api/posts')

    expect(res.status).toBe(200)
    expect(res.body.data).toBeInstanceOf(Array)
  })

  // GET /api/posts/:id
  test('GET /api/posts/:id - should return a single post', async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue({
      id: 1, content: 'Post 1', authorId: 42, createdAt: new Date(), updatedAt: new Date(),
    })

    const res = await request(app).get('/api/posts/1')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('id', 1)
  })

  // POST /api/posts
  test('POST /api/posts - should create a new post', async () => {
    vi.mocked(prisma.post.create).mockResolvedValue({
      id: 2, content: 'New post', authorId: 42, createdAt: new Date(), updatedAt: new Date(),
    })

    const res = await request(app)
      .post('/api/posts')
      .send({ content: 'New post' })

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Post created!')
  })

  // PATCH /api/posts/:id
  test('PATCH /api/posts/:id - should update a post', async () => {
    vi.mocked(prisma.post.update).mockResolvedValue({
      id: 1, content: 'Updated', authorId: 42, createdAt: new Date(), updatedAt: new Date(),
    })

    const res = await request(app)
      .patch('/api/posts/1')
      .send({ content: 'Updated' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Post updated!')
  })

  // DELETE /api/posts/:id
  test('DELETE /api/posts/:id - should delete a post', async () => {
    vi.mocked(prisma.post.delete).mockResolvedValue({
      id: 1, content: 'Post 1', authorId: 42, createdAt: new Date(), updatedAt: new Date(),
    })

    const res = await request(app).delete('/api/posts/1')

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Post deleted!')
  })
})
