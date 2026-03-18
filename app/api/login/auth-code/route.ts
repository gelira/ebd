import { deactivateAuthCode, generateAuthCode, validateAuthCode } from '@/app/_lib/services/auth-code'
import { CustomError, responseHandlingCustomError } from '@/app/_lib/utils/custom-error'
import { generateToken } from '@/app/_lib/utils/token'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

const Schema = z.object({
  authCodeId: z.int(),
  code: z.string().min(6).max(6),
})

function validateBody(body: any) {
  try {
    return Schema.parse(body)
  } catch (err) {
    throw new CustomError('Invalid body', 400)
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return Response.json({ error: 'Email is required' }, {
        status: 400
      })
    }

    const authCode = await generateAuthCode({ email })
    
    return Response.json({ authCodeId: authCode.id }, {
      status: 200
    })

  } catch (err) {
    return responseHandlingCustomError(err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { authCodeId, code } = validateBody(body)

    const authCode = await validateAuthCode({ authCodeId, code })

    const userId = authCode.userId
    const userRole = authCode.user.role

    const token = generateToken({ userId, userRole })

    await deactivateAuthCode({ authCodeId })

    return Response.json({ token }, {
      status: 200
    })

  } catch (err) {
    return responseHandlingCustomError(err)
  }
}