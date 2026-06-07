import 'server-only'
import { dbGetCongregationsByUserId } from '@/app/_lib/db/congregation'
import { cache } from 'react'
import { getCurrentUser } from './auth'

export const getCongregationsOfCurrentUser = cache(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return await dbGetCongregationsByUserId({ userId: user.id })
})
