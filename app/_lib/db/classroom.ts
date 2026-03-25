import prisma from './prisma'

export async function getClassroom({ id, userId }: { id: number, userId: number }) {
  return await prisma.classroom.findFirst({
    where: {
      AND: [
        { id },
        {
          OR: [
            {
              usersClassroom: {
                some: {
                  userId,
                },
              },    
            },
            {
              congregation: {
                usersCongregation: {
                  some: {
                    userId,
                  },
                },
              },
            },
          ],
        },
      ]
    },
  })
}

export async function getClassroomsByUserId(userId: number) {
  return await prisma.classroom.findMany({
    where: {
      OR: [
        {
          usersClassroom: {
            some: {
              userId,
            },
          },    
        },
        {
          congregation: {
            usersCongregation: {
              some: {
                userId,
              },
            },
          },
        },
      ],
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export async function getClassroomsByCongregationId(congregationId: number) {
  return await prisma.classroom.findMany({
    where: {
      congregationId,
    },
    orderBy: {
      name: 'asc',
    },
  })
}
