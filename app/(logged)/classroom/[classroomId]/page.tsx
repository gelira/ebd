import { getCurrentClassroom } from '@/app/_lib/services/classroom'
import { getCurrentTerm } from '@/app/_lib/services/term'
import { notFound } from 'next/navigation'
import Enrollments from './_components/enrollments'
import { getEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'

export default async function Page({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params

  const classroom = await getCurrentClassroom(Number(classroomId))

  if (!classroom) {
    notFound()
  }

  const currentTerm = await getCurrentTerm()

  const enrollments = await getEnrollmentsByClassroomAndTerm({
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
    <div className="m-4">
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
    </div>
  )
}