import { dbGetEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'
import { dbGetLessonReport } from '@/app/_lib/db/lesson-report'
import { requireUser } from '@/app/_lib/services/auth'
import { requireClassroom } from '@/app/_lib/services/classroom'
import { requireLesson } from '@/app/_lib/services/lesson'
import RegisterLessonReport from './_components/register-lesson-report'

export default async function Page({ params }: {
  params: Promise<{
    classroomId: string
    lessonId: string
  }>
}) {
  const { classroomId, lessonId } = await params
  
  const user = await requireUser()
  const [classroom, lesson] = await Promise.all([
    requireClassroom({ classroomId, userId: user.id }),
    requireLesson({ lessonId, churchId: user.churchId })
  ])

  const lessonReport = await dbGetLessonReport({
    classroomId: classroom.id,
    lessonId: lesson.id,
  })

  if (lessonReport) {
    return (
      <h1>Já registrado</h1>
    )
  }

  const enrollments = await dbGetEnrollmentsByClassroomAndTerm({
    classroomId: classroom.id,
    termId: lesson.termId,
  })

  return (
    <div>
      <h2>Registro de aula</h2>
      <h3>{lesson.lessonName} - {lesson.term.termName}/{lesson.term.year} - {classroom.name}</h3>
      <RegisterLessonReport
        enrollments={enrollments}
        classroomId={classroom.id}
        lessonId={lesson.id}
      />
    </div>
  )
}