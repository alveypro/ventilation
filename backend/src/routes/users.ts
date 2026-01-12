import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// 用户注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ code: 400, message: 'User already exists' })
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()
    res.status(201).json({ code: 201, message: 'User registered', data: user.toJSON() })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

// 用户登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ code: 401, message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ code: 401, message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    })

    res.json({
      code: 200,
      message: 'Login successful',
      data: { user: user.toJSON(), token },
    })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

// 获取当前用户
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId)
    res.json({ code: 200, message: 'Success', data: user?.toJSON() })
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Server error' })
  }
})

export default router
