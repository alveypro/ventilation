import { Router, Request, Response } from 'express'
import { seedDiseases } from '../data/seed.js'

const router = Router()

// 获取所有疾病指南
router.get('/', (req: Request, res: Response) => {
  res.json({ code: 200, message: 'Success', data: seedDiseases })
})

// 获取单个疾病指南
router.get('/:id', (req: Request, res: Response) => {
  const diseaseId = Number(req.params.id)
  const disease = seedDiseases.find(item => item.id === diseaseId)
  if (!disease) {
    return res.status(404).json({ code: 404, message: 'Disease not found' })
  }
  res.json({ code: 200, message: 'Success', data: disease })
})

export default router
