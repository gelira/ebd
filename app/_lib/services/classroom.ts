import 'server-only'

import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { parseIntParam } from '@/app/_lib/utils/params'
import { notFound } from 'next/navigation'
import { cache } from 'react'

const getClassroom = cache(dbGetClassroom)

export async function requireClassroom({ classroomId, userId }: {
  classroomId: any
  userId: number
}) {
  const parsedId = parseIntParam(classroomId)

  const classroom = await getClassroom({ id: parsedId, userId })

  if (!classroom) {
    notFound()
  }

  return classroom
}