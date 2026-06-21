import 'server-only'
import { dbGetLesson } from '@/app/_lib/db/lesson'
import { parseIntParam } from '@/app/_lib/utils/params'
import { notFound } from 'next/navigation'

export async function requireLesson({ lessonId, churchId }: {
  lessonId: any
  churchId: number
}) {
  const parsedId = parseIntParam(lessonId)

  const lesson = await dbGetLesson({ id: parsedId, churchId })

  if (!lesson) {
    notFound()
  }

  return lesson
}