import 'server-only'
import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { cache } from 'react'
import { getCurrentUser } from './auth'

export const getCurrentClassroom = cache(async (id: number) => {
  const user = await getCurrentUser()

  if (!user || isNaN(id)) {
    return null
  }

  return await dbGetClassroom({ id, userId: user.id })
})
