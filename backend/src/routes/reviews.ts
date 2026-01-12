import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import { Review } from '../models/Review.js'
import { authenticateToken } from '../middleware/auth.js'
import { seedReviews } from '../data/seed.js'

const router = Router()

// 获取所有测评
router.get('/', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ code: 200, message: 'Success', data: seedReviews })
    }
    const reviews = await Review.find().sort({ date: -1 })
    res.json({ code: 200, message: 'Success', data: reviews })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

// 获取单个测评
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const reviewId = Number(req.params.id)
      const review = seedReviews.find(item => item.id === reviewId)
      if (!review) {
        return res.status(404).json({ code: 404, message: 'Review not found' })
      }
      return res.json({ code: 200, message: 'Success', data: review })
    }
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!review) {
      return res.status(404).json({ code: 404, message: 'Review not found' })
    }
    res.json({ code: 200, message: 'Success', data: review })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

// 创建测评
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ code: 503, message: 'Database unavailable' })
    }
    const review = new Review(req.body)
    await review.save()
    res.status(201).json({ code: 201, message: 'Review created', data: review })
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Invalid data' })
  }
})

// 更新测评
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ code: 503, message: 'Database unavailable' })
    }
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.json({ code: 200, message: 'Updated', data: review })
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Invalid data' })
  }
})

// 删除测评
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ code: 503, message: 'Database unavailable' })
    }
    await Review.findByIdAndDelete(req.params.id)
    res.json({ code: 200, message: 'Deleted' })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

export default router
