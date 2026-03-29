import { getPersonsWithoutEnrollments } from '@/app/_lib/db/person'
import { getCurrentClassroom } from '@/app/_lib/services/classroom'
import { getCurrentTerm } from '@/app/_lib/services/term'
import { notFound } from 'next/navigation'
import PersonSelect from '../_components/person-select'

export default async function Page({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params

  const classroom = await getCurrentClassroom(Number(classroomId))

  if (!classroom) {
    notFound()
  }

  const term = await getCurrentTerm()

  const persons = term && await getPersonsWithoutEnrollments({
    termId: term.id,
    churchId: term.churchId,
    congregationId: classroom.congregationId,
  })

  return (
    <div>
      <h2>Matricular Novo aluno</h2>
      {term && persons ? (
        <PersonSelect
          classroomId={classroom.id}
          termId={term.id}
          persons={persons}
          enrollmentType="STUDENT"
        />
      ) : (
        <h2>Não há período atual</h2>
      )}
    </div>
  )
}