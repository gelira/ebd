import prisma from './prisma'

export async function getUserFromValidAuthCode({ authCodeId, code }: { authCodeId: number, code: string }) {
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

  return authCode?.user
}

export async function deactivateAuthCode({ authCodeId }: { authCodeId: number }) {
  await prisma.authCode.update({
    where: {
      id: authCodeId,
    },
    data: {
      isActive: false,
    },
  })
}
