import { sign } from 'jsonwebtoken'

export function generateToken(payload: { userId: number, userRole: string }) {
  const secretKey = process.env.JWT_SECRET_KEY

  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined')
  }

  return sign(payload, secretKey, {
    expiresIn: '8h',
    algorithm: 'HS512',
  })
}