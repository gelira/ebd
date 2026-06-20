import 'server-only'
import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { cache } from 'react'

export const getCurrentClassroom = cache(async (id: number, userId: number) => {
  return await dbGetClassroom({ id, userId })
})
