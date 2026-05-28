import 'server-only'

import prisma from './prisma'

export async function dbFindUserByEmail({ email }: {
  email: string
}) {
  return await prisma.user.findUnique({
    where: { email },
  })
}
