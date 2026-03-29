import prisma from '@/app/_lib/db/prisma'
import { cache } from 'react'
import { getCurrentUser } from './auth'

export const getCurrentTerm = cache(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return await prisma.term.findFirst({
    where: {
      churchId: user.churchId,
      completed: false,
    },
    orderBy: [
      { year: 'desc' },
      { termName: 'desc' },
    ],
  })
})