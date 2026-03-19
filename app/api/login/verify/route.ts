import { verifyToken, AUTH_TOKEN_COOKIE_NAME } from '@/app/_lib/utils/token'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    let token = request.headers.get('Authorization')

    if (!token) {
      const cookieStore = await cookies()

      token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value ?? ''
    }

    if (!token) {
      throw new Error()
    }

    const { userId, userRole} = verifyToken(token)

    return Response.json({ userId, userRole}, {
      status: 200
    })

  } catch {
    return new Response(null, {
      status: 401
    })
  }
}
