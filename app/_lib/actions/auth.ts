'use server'

import prisma from '@/app/_lib/db/prisma'
import {
  createAuthCode,
  generateToken,
  setAuthTokenInCookies
} from '@/app/_lib/services/auth'
import { sendAuthCode } from '@/app/_lib/utils/mail'

export async function actionGenerateAuthCode({ email }: {
  email: string
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { ok: false, authCodeId: -1 }
    }

    const authCode = await createAuthCode(user.id)

    sendAuthCode(email, authCode.code)

    return { ok: true, authCodeId: authCode.id }
  } catch {
    return { ok: false, authCodeId: -1 }
  }
}

export async function actionValidateAuthCode({ authCodeId, code }: {
  authCodeId: number,
  code: string
}) {
  try {
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
      return { ok: false }
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

    return { ok: true }
  } catch {
    return { ok: false }
  }
}
