'use server'

import { dbDeactivateAuthCode, dbGetUserFromValidAuthCode } from '@/app/_lib/db/auth-code'
import { dbFindUserByEmail } from '@/app/_lib/db/user'
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
    const user = await dbFindUserByEmail({ email })

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
    const user = await dbGetUserFromValidAuthCode({ authCodeId, code })

    if (!user) {
      return { ok: false }
    }

    const token = generateToken({ userId: user.id })

    await dbDeactivateAuthCode({ authCodeId })
    await setAuthTokenInCookies(token)

    return { ok: true }
  } catch {
    return { ok: false }
  }
}
