import { Router, Request, Response } from 'express'
import { seedBrands } from '../data/seed.js'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ code: 200, message: 'Success', data: seedBrands })
})

router.get('/:id', (req: Request, res: Response) => {
  const brandId = Number(req.params.id)
  const brand = seedBrands.find(item => item.id === brandId)
  if (!brand) {
    return res.status(404).json({ code: 404, message: 'Brand not found' })
  }
  res.json({ code: 200, message: 'Success', data: brand })
})

export default router
