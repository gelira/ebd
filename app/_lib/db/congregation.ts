import prisma from './prisma'

export async function getCongregationsByUserId(userId: number) {
  return await prisma.congregation.findMany({
    where: {
      usersCongregation: {
        some: {
          userId,
        },
      },
    },
  })
}

export async function getCongregation({ id, userId }: { id: number, userId: number }) {
  return await prisma.congregation.findFirst({
    where: {
      id,
      usersCongregation: {
        some: {
          userId,
        },
      },
    },
  })
}