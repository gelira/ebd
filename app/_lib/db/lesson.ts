import 'server-only'
import prisma from './prisma'

export async function dbGetUncompletedLessonsByTerm({ termId }: {
  termId: number
}) {
  return await prisma.lesson.findMany({
    where: {
      termId,
      completed: false,
    },
    orderBy: {
      lessonName: 'asc',
    },
  })
}

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
