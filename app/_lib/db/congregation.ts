import 'server-only'

import { cache } from 'react'
import prisma from './prisma'

export async function dbGetUserCongregations(userId: number) {
  return await prisma.congregation.findMany({
    where: {
      usersCongregation: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export const dbCachedGetUserCongregations = cache(dbGetUserCongregations)
 
export async function dbGetCongregation(id: number, userId: number) {
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