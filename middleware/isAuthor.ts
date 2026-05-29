import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'

export const validateAuthor = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const postId = parseInt(req.params.id)
		const { userId } = req.user!
		const post = await prisma.post.findUnique({ where: { id: postId }})
		if (!post) {
			return res.status(404).json({ message: "Post not found" })
		}
		if (post.authorId !== userId) {
			return res.status(403).json({ message: "Forbidden"})
		}
		next()
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: "Internal server error" })
	}
}