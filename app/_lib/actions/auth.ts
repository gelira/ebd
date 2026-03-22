'use server'

import prisma from '@/app/_lib/db/prisma'
import { deactivateAuthCode, getUserFromValidAuthCode } from '@/app/_lib/db/auth-code'
import { createAuthCode, generateToken, setAuthTokenInCookies } from '@/app/_lib/services/auth'
import { redirect } from 'next/navigation'

export async function generateAuthCode({ email }: { email: string }) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { ok: false }
  }

  const authCode = await createAuthCode(user.id)

  return { ok: true, authCodeId: authCode.id }
}

export async function validateAuthCode({ authCodeId, code }: { authCodeId: number, code: string }) {
  const user = await getUserFromValidAuthCode({ authCodeId, code })

  if (!user) {
    return { ok: false }
  }

  const token = generateToken({ userId: user.id })

  await setAuthTokenInCookies(token)
  await deactivateAuthCode({ authCodeId })

  redirect('/')
}
