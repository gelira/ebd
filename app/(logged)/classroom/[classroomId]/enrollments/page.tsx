import { dbGetPersonsWithoutEnrollmentsInClassroom } from '@/app/_lib/db/person'
import { dbGetCurrentTerm } from '@/app/_lib/db/term'
import { requireUser } from '@/app/_lib/services/auth'
import { requireClassroom } from '@/app/_lib/services/classroom'
import PersonSelect from '../_components/person-select'

export default async function Page({ params }: {
  params: Promise<{ classroomId: string }>
}) {
  const { classroomId } = await params
  
  const user = await requireUser()
  const classroom = await requireClassroom({ classroomId, userId: user.id })

  const term = await dbGetCurrentTerm({
    churchId: user.churchId
  })

  const persons = term && await dbGetPersonsWithoutEnrollmentsInClassroom({
    classroomId: classroom.id,
    churchId: term.churchId,
    termId: term.id,
  })

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body gap-4">
        <h2 className="card-title text-lg">
          Nova Matricula - {classroom.name}
        </h2>

        <PersonSelect
          classroomId={classroom.id}
          termId={term?.id}
          persons={persons ?? []}
          enrollmentType="STUDENT"
        />
      </div>
    </div>
  )
}