import { getCurrentClassroom } from '@/app/_lib/services/classroom'
import { getCurrentTerm } from '@/app/_lib/services/term'
import { notFound } from 'next/navigation'
import Enrollments from './_components/enrollments'

export default async function Page({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params

  const classroom = await getCurrentClassroom(Number(classroomId))

  if (!classroom) {
    notFound()
  }

  const currentTerm = await getCurrentTerm()

  return (
    <div>
      <h1>{classroom.name}</h1>
      {currentTerm ? (
        <>
          <h2>{currentTerm.termName} - {currentTerm.year}</h2>
          <Enrollments classroomId={classroom.id} />
        </>
      ) : (
        <h2>Não há período atual</h2>
      )}
    </div>
  )
}