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

export async function dbGetLessonReportsByLesson({ lessonId }: {
  lessonId: number
}) {
  return await prisma.lessonReport.findMany({
    where: {
      lessonId,
    },
    include: {
      classroom: true,
      attendances: true,
    },
  })
}

export type LessonReportsByLesson = Awaited<ReturnType<typeof dbGetLessonReportsByLesson>>

