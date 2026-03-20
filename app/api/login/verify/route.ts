import { getAuthenticatedUser } from '@/app/_lib/utils/auth'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization') || undefined

    const user = await getAuthenticatedUser(token)

    if (!user) {
      throw new Error()
    }

    return Response.json({ userId: user.id }, {
      status: 200
    })

  } catch {
    return new Response(null, {
      status: 401
    })
  }
}
