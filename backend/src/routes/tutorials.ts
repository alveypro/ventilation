import { Router, Request, Response } from 'express'
import { seedTutorials } from '../data/seed.js'

const router = Router()

// 获取所有教程
router.get('/', (req: Request, res: Response) => {
  res.json({ code: 200, message: 'Success', data: seedTutorials })
})

// 获取单个教程
router.get('/:id', (req: Request, res: Response) => {
  const tutorialId = Number(req.params.id)
  const tutorial = seedTutorials.find(item => item.id === tutorialId)
  if (!tutorial) {
    return res.status(404).json({ code: 404, message: 'Tutorial not found' })
  }
  res.json({ code: 200, message: 'Success', data: tutorial })
})

export default router
