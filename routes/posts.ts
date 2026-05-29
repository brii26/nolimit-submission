import { Router, type Request, type Response } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validateAuthor } from '../middleware/isAuthor.js'
import { prisma } from '../lib/prisma.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
	try{
		const posts = await prisma.post.findMany()
		res.status(200).json({ data: posts })
	} catch(err){
		console.log(err)
		res.status(500).json({ message: "Failed to retreive posts" })
	}
})

router.get('/:id', async (req: Request, res: Response) => {
	try{
		const id = parseInt(req.params.id)
		const post = await prisma.post.findUnique({ where: { id: id }})
		if (!post) {
			return res.status(404).json({ message: "Post not found"})
		}
		res.status(200).json({ data: post })
	} catch(err){
		console.log(err)
		res.status(500).json({ message: "Failed to retrieve post" })
	}
})

// verify auth middleware
router.post('/', authenticate, async (req: Request, res: Response) => {
	try {
		const { content } = req.body
		const { userId } = req.user!
		await prisma.post.create({ data: {content: content, authorId: userId}})
		res.status(201).json({ message: "Post created!" })
	} catch(err){
		console.log(err)
		res.status(500).json({ message: "Failed to create post"})
	}
	
})

// verify auth middleware ,  validate author
router.patch('/:id', authenticate, validateAuthor, async (req: Request, res: Response) => {
	try {
		const postId = parseInt(req.params.id)
		const { content } = req.body
		await prisma.post.update({where: { id: postId }, data: { content: content } })
		res.status(200).json({ message: "Post updated!" })
	} catch(err) {
		console.log(err)
		res.status(500).json({ message: "Failed editing post" })
	}
})

// verify auth middleware ,  validate author
router.delete('/:id', authenticate, validateAuthor, async (req: Request, res: Response) => {
	try {
		const postId = parseInt(req.params.id)
		await prisma.post.delete({ where: { id: postId } })
		res.status(200).json({ message: "Post deleted!"})
	} catch(err) {
		console.log(err)
		res.status(500).json({ message: "Failed to delete post" })
	}
})

export default router