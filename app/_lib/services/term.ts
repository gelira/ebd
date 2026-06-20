import prisma from '@/app/_lib/db/prisma'
import { cache } from 'react'

export const getCurrentTerm = cache(async (churchId: number) => {
  return await prisma.term.findFirst({
    where: {
      churchId,
      completed: false,
    },
    orderBy: [
      { year: 'desc' },
      { termName: 'desc' },
    ],
  })
})