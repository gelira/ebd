import prisma from '@/app/_lib/db/prisma'
import { createAuthCode, generateToken, setAuthTokenInCookies } from '@/app/_lib/services/auth'
import { sendAuthCode } from '@/app/_lib/utils/mail'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const email = searchParams.get('email')
  
    if (!email) {
      return NextResponse.json({}, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const authCode = await createAuthCode(user.id)

    sendAuthCode(email, authCode.code)

    return NextResponse.json({ authCodeId: authCode.id })

  } catch {
    return NextResponse.json({
      message: 'error to process this request'
    }, { status: 500 })
  }
}

const PostSchema = z.object({
  authCodeId: z.number(),
  code: z.string().regex(/^\d{6}$/)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = PostSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        z.treeifyError(validation.error),
        { status: 400 }
      )
    }

    const { authCodeId, code } = validation.data

    const authCode = await prisma.authCode.findFirst({
      where: {
        id: authCodeId,
        code,
        isActive: true,
        expiredAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
      },
    })

    const user = authCode?.user

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const token = generateToken({ userId: user.id })

    await prisma.authCode.update({
      where: {
        id: authCodeId,
      },
      data: {
        isActive: false,
      },
    })

    await setAuthTokenInCookies(token)
  
    return NextResponse.json({}, { status: 200 })

  } catch {
    return NextResponse.json({
      message: 'error to process this request'
    }, { status: 500 })
  }
}