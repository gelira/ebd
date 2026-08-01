import 'server-only'
import prisma from './prisma'

export async function dbGetCongregation({ id, userId }: {
  id: number
  userId: number
}) {
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