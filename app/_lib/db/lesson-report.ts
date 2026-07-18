import 'server-only'
import prisma from './prisma'

export async function dbGetLessonReport({ classroomId, lessonId }: {
  classroomId: number
  lessonId: number
}) {
  return await prisma.lessonReport.findUnique({
    where: {
      lessonId_classroomId: {
        classroomId,
        lessonId,
      },
    },
  })
}
