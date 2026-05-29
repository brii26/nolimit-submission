import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '../config.js'
import type { JwtPayload } from '../types/express.js'

export const authenticate = (req: Request, res: Response , next: NextFunction) => {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) {
		return res.status(401).json({ message: 'No token' })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		req.user = decoded as JwtPayload
		next()
	} catch {
		res.status(401).json({ message: 'Invalid token'})
	}
}