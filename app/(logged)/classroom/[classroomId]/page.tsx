import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { dbGetEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'
import { dbGetCurrentTerm } from '@/app/_lib/db/term'
import { requireUser } from '@/app/_lib/services/auth'
import { parseIntParam } from '@/app/_lib/utils/params'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Enrollments from './_components/enrollments'

export default async function Page({ params }: {
  params: Promise<{ classroomId: string }>
}) {
  const { classroomId } = await params

  const parsedId = parseIntParam(classroomId)

  const user = await requireUser()

  const classroom = await dbGetClassroom({
    id: parsedId,
    userId: user.id
  })

  if (!classroom) {
    notFound()
  }

  const currentTerm = await dbGetCurrentTerm({
    churchId: user.churchId
  })

  const enrollments = await dbGetEnrollmentsByClassroomAndTerm({
    termId: currentTerm?.id ?? 0,
    classroomId: classroom.id
  })

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{classroom.name}</h2>
        {currentTerm ? (
          <>
            <div className="badge badge-neutral badge-outline">
              {currentTerm.termName} - {currentTerm.year}
            </div>
            {enrollments.length > 0 ? (
              <Enrollments {...{ enrollments }} />
            ) : (
              <p>Nenhuma matrícula para o período atual</p>
            )}
            <Link href={`/classroom/${classroomId}/enrollments`}>Nova matrícula</Link>
          </>
        ) : (
          <h2>Não há período atual</h2>
        )}
      </div>
    </div>
  )
}