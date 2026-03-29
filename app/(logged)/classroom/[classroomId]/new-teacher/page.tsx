import { getPersons } from '@/app/_lib/db/person'
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

  const persons = term && await getPersons({ churchId: term.churchId })

  return (
    <div>
      <h2>Matricular Novo professor</h2>
      {term && persons ? (
        <PersonSelect
          classroomId={classroom.id}
          termId={term.id}
          persons={persons}
          enrollmentType="TEACHER"
        />
      ) : (
        <h2>Não há período atual</h2>
      )}
    </div>
  )
}