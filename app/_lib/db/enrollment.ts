import 'server-only'
import prisma from './prisma'

export async function dbGetEnrollmentsByClassroomAndTerm({ classroomId, termId }: {
  classroomId: number
  termId: number
}) {
  return await prisma.enrollment.findMany({
    where: {
      classroomId,
      termId,
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

export type EnrollmentWithPerson = Awaited<ReturnType<typeof dbGetEnrollmentsByClassroomAndTerm>>[number]
