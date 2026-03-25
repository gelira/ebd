import { getCurrentClassroom } from '@/app/_lib/services/classroom'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params

  const classroom = await getCurrentClassroom(Number(classroomId))

  if (!classroom) {
    notFound()
  }

  return (
    <div>
      <h1>{classroom.name}</h1>
    </div>
  )
}