import express from 'express'
import authRouter from './routes/auth.js'
import postsRouter from './routes/posts.js'

const app = express()

// middleware pasrse for req body
app.use(express.json())

// router handler
const BASE_URL= '/api'
app.use(`${BASE_URL}/auth`, authRouter)
app.use(`${BASE_URL}/posts`, postsRouter)

export default app