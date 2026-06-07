import { notFound } from 'next/navigation'
import Enrollments from './_components/enrollments'
import { dbGetEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'
import { getCurrentUser } from '@/app/_lib/services/auth'
import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { dbGetCurrentTerm } from '@/app/_lib/db/term'
import { parseIntParam } from '@/app/_lib/utils/params'

export default async function Page({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params

  const parsedId = parseIntParam(classroomId)

  const user = await getCurrentUser()

  const classroom = await dbGetClassroom({
    id: parsedId,
    userId: user?.id ?? 0
  })

  if (!classroom) {
    notFound()
  }

  const currentTerm = await dbGetCurrentTerm({
    churchId: user?.churchId ?? 0
  })

  const enrollments = await dbGetEnrollmentsByClassroomAndTerm({
    termId: currentTerm?.id ?? 0,
    classroomId: classroom.id
  })

  const { teachers, students } = enrollments.reduce((acc, curr) => {
    if (curr.enrollmentType === 'TEACHER') {
      acc.teachers.push(curr)
    } else {
      acc.students.push(curr)
    }

    return acc
  }, { teachers: [] as typeof enrollments, students: [] as typeof enrollments })

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{classroom.name}</h2>
        {currentTerm ? (
          <>
            <div className="badge badge-neutral badge-outline">
              {currentTerm.termName} - {currentTerm.year}
            </div>
            <Enrollments
              classroomId={classroom.id}
              classroomName={classroom.name}
              teachers={teachers}
              students={students}
            />
          </>
        ) : (
          <h2>Não há período atual</h2>
        )}
      </div>
    </div>
  )
}