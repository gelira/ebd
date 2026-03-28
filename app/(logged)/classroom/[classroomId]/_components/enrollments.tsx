import { getEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'
import { getCurrentTerm } from '@/app/_lib/services/term'

export default async function Enrollments({ classroomId }: { classroomId: number }) {
  const term = await getCurrentTerm()

  if (!term) {
    return null
  }

  const termId = term.id

  const enrollments = await getEnrollmentsByClassroomAndTerm({ termId, classroomId })

  const { teachers, students } = enrollments.reduce((acc, curr) => {
    if (curr.enrollmentType === 'TEACHER') {
      acc.teachers.push(curr)
    } else {
      acc.students.push(curr)
    }

    return acc
  }, { teachers: [] as typeof enrollments, students: [] as typeof enrollments })

  return (
    <div>
      <div>
        <h2>Professores</h2>
        {teachers.length ? (
          <ul>
            {teachers.map((teacher) => (
              <li key={teacher.id}>
                {teacher.person.completeName}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum professor encontrado</p>
        )}
      </div>
      <div>
        <h2>Alunos</h2>
        {students.length ? (
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                {student.person.completeName}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum aluno encontrado</p>
        )}
      </div>
    </div>
  )
}