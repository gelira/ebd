import 'server-only'
import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { parseIntParam } from '@/app/_lib/utils/params'
import { notFound } from 'next/navigation'

export async function requireClassroom({ classroomId, userId }: {
  classroomId: any
  userId: number
}) {
  const parsedId = parseIntParam(classroomId)

  const classroom = await dbGetClassroom({ id: parsedId, userId })

  if (!classroom) {
    notFound()
  }

  return classroom
}