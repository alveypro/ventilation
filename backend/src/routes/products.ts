import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import { Product } from '../models/Product.js'
import { authenticateToken } from '../middleware/auth.js'
import { seedProducts } from '../data/seed.js'

const router = Router()

// 获取所有产品
router.get('/', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ code: 200, message: 'Success', data: seedProducts })
    }
    const products = await Product.find()
    res.json({ code: 200, message: 'Success', data: products })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

// 搜索产品
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string
    if (mongoose.connection.readyState !== 1) {
      if (!query) {
        return res.json({ code: 200, message: 'Success', data: seedProducts })
      }
      const keyword = query.toLowerCase()
      const filtered = seedProducts.filter(product =>
        `${product.name} ${product.brand}`.toLowerCase().includes(keyword)
      )
      return res.json({ code: 200, message: 'Success', data: filtered })
    }
    if (!query) {
      const products = await Product.find()
      return res.json({ code: 200, message: 'Success', data: products })
    }
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ],
    })
    res.json({ code: 200, message: 'Success', data: products })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

// 获取单个产品
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const numericId = Number(req.params.id)
      const product = seedProducts.find(item => item.id === numericId)
      if (!product) {
        return res.status(404).json({ code: 404, message: 'Product not found' })
      }
      return res.json({ code: 200, message: 'Success', data: product })
    }
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ code: 404, message: 'Product not found' })
    }
    res.json({ code: 200, message: 'Success', data: product })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

// 创建产品 (仅管理员)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ code: 503, message: 'Database unavailable' })
    }
    const product = new Product(req.body)
    await product.save()
    res.status(201).json({ code: 201, message: 'Product created', data: product })
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Invalid data' })
  }
})

// 更新产品
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ code: 503, message: 'Database unavailable' })
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.json({ code: 200, message: 'Updated', data: product })
  } catch (error) {
    res.status(400).json({ code: 400, message: 'Invalid data' })
  }
})

// 删除产品
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ code: 503, message: 'Database unavailable' })
    }
    await Product.findByIdAndDelete(req.params.id)
    res.json({ code: 200, message: 'Deleted' })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

export default router
