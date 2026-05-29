import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { JWT_SECRET } from '../config.js'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body

		// hash password
		const hashed = await bcrypt.hash(password, 10)

		// masuk db
		const user = await prisma.user.create({
			data: { name, email, password: hashed }
		})

		// no include password
		const { password: _, ...userWithoutPassword } = user
		res.status(201).json({ data: userWithoutPassword })
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Failed to register' })
	}
})

router.post('/login', async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		// cek ada or not di db
		const user = await prisma.user.findUnique({ where: { email } })
		if (!user) return res.status(401).json({ message: 'Invalid credentials' })

		// compare hashed password
		const valid = await bcrypt.compare(password, user.password)
		if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

		// sign credentials
		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET)
		res.json({ token })
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Failed to login' })
	}
})

export default router