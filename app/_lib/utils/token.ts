import { sign, verify } from 'jsonwebtoken'

export const JWT_EXPIRES_IN = 60 * 60 * 8
export const AUTH_TOKEN_COOKIE_NAME = 'auth_token'

const JWT_ALGORITHM = 'HS512'

export function generateToken(payload: { userId: number, userRole: string }) {
  const secretKey = process.env.JWT_SECRET_KEY

  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined')
  }

  return sign(payload, secretKey, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
  })
}

export function verifyToken(token: string) {
  const secretKey = process.env.JWT_SECRET_KEY

  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined')
  }

  const decoded = verify(token, secretKey)

  return decoded as { userId: number, userRole: string }
}