import { getClassroom, getClassroomsByCongregationId, getClassroomsByUserId } from '@/app/_lib/db/classroom'
import { cache } from 'react'
import { getCurrentCongregation } from './congregation'
import { getCurrentUser } from './auth'

export const getCurrentClassroom = cache(async (id: number) => {
  const user = await getCurrentUser()

  if (!user || isNaN(id)) {
    return null
  }

  return await getClassroom({ id, userId: user.id })
})

export const getClassroomsOfCurrentUser = cache(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return await getClassroomsByUserId(user.id)
})


export const getClassroomsOfCurrentCongregation = cache(async (congregationId: number) => {
  const congregation = await getCurrentCongregation(congregationId)

  if (!congregation) {
    return null
  }

  return await getClassroomsByCongregationId(congregation.id)
})
