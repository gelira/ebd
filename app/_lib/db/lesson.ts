import 'server-only'
import prisma from './prisma'

export async function dbGetLesson({ id, churchId }: {
  id: number
  churchId: number
}) {
  return await prisma.lesson.findFirst({
    where: {
      id,
      term: {
        churchId,
      },
    },
    include: {
      term: true,
    },
  })
}
