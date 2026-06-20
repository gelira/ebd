import 'server-only'
import prisma from './prisma'

export async function dbGetCurrentTerm({ churchId }: {
  churchId: number
}) {
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
}