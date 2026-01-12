import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
  user?: any
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ code: 401, message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ code: 403, message: 'Token invalid or expired' })
    }
    req.userId = decoded.userId
    next()
  })
}
