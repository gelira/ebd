import { getEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'
import { getCurrentTerm } from '@/app/_lib/services/term'
import Link from 'next/link'

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
    <>
      <ul className="list bg-base-100 rounded-box shadow-md">
        
        <li className="p-4 pb-2">Professores</li>

        {!teachers?.length && (
          <li className="list-row">
            <div className="list-col-grow flex items-center">
              <div>Nenhum professor encontrado</div>
            </div>
          </li>
        )}

        {teachers?.map((teacher) => (
          <li className="list-row" key={teacher.id}>
            <div className="list-col-grow flex items-center">
              <div>{teacher.person.completeName}</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

            </button>
          </li>
        ))}

        <li className="list-row">
          <Link href={`/classroom/${classroomId}/new-teacher`}>
            <button className="btn btn-soft btn-primary">Matricular novo professor</button>
          </Link>
        </li>
      </ul>

      <ul className="list bg-base-100 rounded-box shadow-md">
        
        <li className="p-4 pb-2">Alunos</li>

        {!students?.length && (
          <li className="list-row">
            <div className="list-col-grow flex items-center">
              <div>Nenhum aluno encontrado</div>
            </div>
          </li>
        )}

        {students?.map((student) => (
          <li className="list-row" key={student.id}>
            <div className="list-col-grow flex items-center">
              <div>{student.person.completeName}</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

            </button>
          </li>
        ))}

        <li className="list-row">
          <Link href={`/classroom/${classroomId}/new-student`}>
            <button className="btn btn-soft btn-primary">Matricular novo aluno</button>
          </Link>
        </li>
      </ul>
    </>
  )
}