import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import productRoutes from './routes/products.js'
import reviewRoutes from './routes/reviews.js'
import diseaseRoutes from './routes/diseases.js'
import tutorialRoutes from './routes/tutorials.js'
import userRoutes from './routes/users.js'
import brandRoutes from './routes/brands.js'
import selectorRoutes from './routes/selector.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// 连接数据库
connectDB()

// API 路由
app.use('/api/products', productRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/diseases', diseaseRoutes)
app.use('/api/tutorials', tutorialRoutes)
app.use('/api/users', userRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/selector', selectorRoutes)

// 健康检查
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API is running' })
})

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({ code: 404, message: 'Not Found' })
})

// 错误处理
app.use(errorHandler)

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
