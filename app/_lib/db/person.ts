import prisma from './prisma'

export async function getPersons({ churchId }: { churchId: number }) {
  return await prisma.person.findMany({
    where: { churchId },
    orderBy: { completeName: 'asc' },
  })
}

export async function getPerson({ id, churchId }: { churchId: number, id: number }) {
  return await prisma.person.findFirst({
    where: { id, churchId },
  })
}

export async function getPersonsWithoutEnrollmentsInClassroom({ churchId, classroomId, termId, enrollmentType }: {
  enrollmentType: 'TEACHER' | 'STUDENT',
  classroomId: number,
  churchId: number,
  termId: number,
}) {
  return await prisma.person.findMany({
    where: {
      churchId,
      enrollments: {
        none: {
          termId,
          classroomId,
          enrollmentType,
        },
      },
    },
    orderBy: { completeName: 'asc' },
  })
}