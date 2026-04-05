'use client'

import { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import Link from 'next/link'
import { useState } from 'react'

import RemoveEnrollmentModal from './remove-enrollment-modal'

export default function Enrollments(props: {
  classroomId: number,
  classroomName: string,
  teachers: EnrollmentWithPerson[],
  students: EnrollmentWithPerson[],
}) {
  const [teachers, setTeachers] = useState<EnrollmentWithPerson[]>(props.teachers)
  const [students, setStudents] = useState<EnrollmentWithPerson[]>(props.students)
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithPerson>()

  const handleConfirm = () => {
    if (!selectedEnrollment) return

    if (selectedEnrollment.enrollmentType === 'TEACHER') {
      setTeachers(teachers.filter((teacher) => teacher.id !== selectedEnrollment.id))
    } else {
      setStudents(students.filter((student) => student.id !== selectedEnrollment.id))
    }

    setSelectedEnrollment(undefined)
  }

  return (
    <>
      <ul className="list bg-base-100 rounded-box shadow-md">
        
        <li className="p-4 pb-2 text-md font-bold">Professores</li>

        {!teachers.length && (
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
            <button
              className="btn btn-square btn-ghost"
              onClick={() => setSelectedEnrollment(teacher)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </li>
        ))}

        <li className="list-row">
          <Link href={`/classroom/${props.classroomId}/new-teacher`}>
            <button className="btn btn-soft btn-primary">Matricular novo professor</button>
          </Link>
        </li>
      </ul>

      <ul className="list bg-base-100 rounded-box shadow-md">
        
        <li className="p-4 pb-2 text-md font-bold">Alunos</li>

        {!students.length && (
          <li className="list-row">
            <div className="list-col-grow flex items-center">
              <div>Nenhum aluno encontrado</div>
            </div>
          </li>
        )}

        {students.map((student) => (
          <li className="list-row" key={student.id}>
            <div className="list-col-grow flex items-center">
              <div>{student.person.completeName}</div>
            </div>
            <button
              className="btn btn-square btn-ghost"
              onClick={() => setSelectedEnrollment(student)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </li>
        ))}

        <li className="list-row">
          <Link href={`/classroom/${props.classroomId}/new-student`}>
            <button className="btn btn-soft btn-primary">Matricular novo aluno</button>
          </Link>
        </li>
      </ul>

      <RemoveEnrollmentModal
        isOpen={!!selectedEnrollment}
        onClose={() => setSelectedEnrollment(undefined)}
        onConfirm={handleConfirm}
        enrollmentId={selectedEnrollment?.id ?? 0}
        personName={selectedEnrollment?.person.completeName ?? ''}
        classroomName={props.classroomName}
      />
    </>
  )
}