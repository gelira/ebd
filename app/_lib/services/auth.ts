import prisma from '@/app/_lib/db/prisma'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { cache } from 'react'

const JWT_EXPIRES_IN = 8 * 60 * 60 // 8h
const JWT_ALGORITHM = 'HS512'
const AUTH_CODE_EXPIRES_IN = 60 * 15 // 15min
const AUTH_TOKEN_COOKIE_NAME = 'auth_token'

export async function createAuthCode(userId: number) {
  const code = Math.floor(Math.random() * 999999).toString().padStart(6, '0')

  const expiredAt = new Date()
  expiredAt.setSeconds(expiredAt.getMinutes() + AUTH_CODE_EXPIRES_IN)

  return await prisma.authCode.create({
    data: {
      code,
      userId,
      expiredAt,
    },
  })
}

export function generateToken(payload: { userId: number }) {
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

  return decoded as { userId: number }
}

export async function setAuthTokenInCookies(token: string) {
  const cookieStore = await cookies()

  cookieStore.set(AUTH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: JWT_EXPIRES_IN,
  })
}

export async function getAuthenticatedUser(token?: string) {
  try {
    let tokenValue = token

    if (!tokenValue) {
      const cookiesStore = await cookies()

      tokenValue = cookiesStore.get(AUTH_TOKEN_COOKIE_NAME)?.value ?? ''
    }

    const { userId } = verifyToken(tokenValue)

    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

  } catch {
    return null
  }
}

export const getCurrentUser = cache(getAuthenticatedUser)