import { getPersonsWithoutEnrollmentsInClassroom } from '@/app/_lib/db/person'
import { requireUser } from '@/app/_lib/services/auth'
import { getCurrentClassroom } from '@/app/_lib/services/classroom'
import { getCurrentTerm } from '@/app/_lib/services/term'
import { parseIntParam } from '@/app/_lib/utils/params'
import { notFound } from 'next/navigation'
import PersonSelect from '../_components/person-select'

export default async function Page({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params

  const parsedParam = parseIntParam(classroomId)

  const user = await requireUser()
  const classroom = await getCurrentClassroom(parsedParam, user.id)

  if (!classroom) {
    notFound()
  }

  const term = await getCurrentTerm(user.churchId)

  const persons = term && await getPersonsWithoutEnrollmentsInClassroom({
    enrollmentType: 'TEACHER',
    classroomId: classroom.id,
    churchId: term.churchId,
    termId: term.id,
  })

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body gap-4">
        <h2 className="card-title text-lg">
          Matricular Professores - {classroom.name}
        </h2>

        <PersonSelect
          classroomId={classroom.id}
          termId={term?.id}
          persons={persons ?? []}
          enrollmentType="TEACHER"
        />
      </div>
    </div>
  )
}