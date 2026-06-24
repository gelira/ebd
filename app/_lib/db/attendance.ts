import 'server-only'
import prisma from './prisma'

export async function dbGetAttendancesByLessonReport({ lessonReportId }: {
  lessonReportId: number
}) {
  return await prisma.attendance.findMany({
    where: {
      lessonReportId,
    },
    include: {
      person: true,
    },
    orderBy: {
      person: {
        completeName: 'asc',
      },
    },
  })
}
