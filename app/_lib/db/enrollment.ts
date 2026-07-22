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

export async function dbCreateEnrollments({ termId, churchId, classroomId, personIdList }: {
  termId: number
  churchId: number
  classroomId: number
  personIdList: number[]
}) {
  const enrollmentType = 'STUDENT'

  await prisma.$transaction(async (tx) => {
    await Promise.all(
      personIdList.map(async (personId) => {
        const person = await prisma.person.findFirst({
          where: { id: personId, churchId }
        })

        if (!person) {
          throw new Error('Person not found')
        }

        return await tx.enrollment.upsert({
          where: {
            personId_classroomId_termId: {
              personId,
              classroomId,
              termId,
            }
          },
          update: {
            enrollmentType,
          },
          create: {
            personId,
            classroomId,
            termId,
            enrollmentType,
          }
        })
      })
    )
  })
}

export type EnrollmentWithPerson = Awaited<ReturnType<typeof dbGetEnrollmentsByClassroomAndTerm>>[number]
