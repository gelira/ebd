'use client'

import { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import { SubmitEvent, useCallback, useState } from 'react'
import Attendance from './attedance'

/*
lessonId          Int      @map("lesson_id")
  classroomId       Int      @map("classroom_id")
  lessonDate        DateTime @map("lesson_date") @db.Date
  attendanceAmount  Int      @map("attendance_amount")
  absenceAmount     Int      @map("absence_amount")
  visitorsAmount    Int      @map("visitors_amount")
  holyBiblesAmount  Int      @map("holy_bibles_amount")
  lessonBooksAmount Int      @map("lesson_books_amount")
  offeringTotal     Float    @map("offering_total")
  titheTotal

  PRESENT          @map("present")
  ABSENT           @map("absent")
  JUSTIFIED_ABSENT @map("justified_absent")
*/

export default function RegisterLessonReport({
  enrollments,
  // classroomId,
  // lessonId,
}: {
  enrollments: EnrollmentWithPerson[]
  classroomId: number
  lessonId: number
}) {
  const [attendances, setAttendances] = useState<{
    personId: number
    attendance: string
  }[]>([])

  const onAttendanceChange = useCallback(
    (personId: number, attendance: string) => {
      setAttendances((prev) => {
        const existing = prev.some((att) => att.personId === personId)

        if (!existing) {
          return [...prev, { personId, attendance }]
        }

        return prev.map((att) =>
          att.personId === personId
            ? { ...att, attendance }
            : att
        )
      })
    },
    []
  )

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget)

    const lessonDate = formData.get('lessonDate')
    const visitorsAmount = formData.get('visitorsAmount')
    const holyBiblesAmount = formData.get('holyBiblesAmount')
    const lessonBooksAmount = formData.get('lessonBooksAmount')
    const offeringTotal = formData.get('offeringTotal')
    const titheTotal = formData.get('titheTotal')

    console.log('form', {
      lessonDate,
      visitorsAmount,
      holyBiblesAmount,
      lessonBooksAmount,
      offeringTotal,
      titheTotal,
      attendances,
    })
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Data da aula:
            <input type="date" name="lessonDate" required />
          </label>
        </div>
        {enrollments.map((enrollment) => (
          <Attendance
            key={enrollment.id}
            enrollment={enrollment}
            onChange={onAttendanceChange}
          />
        ))}
        <div>
          <label>
            Quantidade de visitantes:
            <input type="number" name="visitorsAmount" />
          </label>
        </div>
        <div>
          <label>
            Quantidade de bíblias:
            <input type="number" name="holyBiblesAmount" />
          </label>
        </div>
        <div>
          <label>
            Quantidade de lições:
            <input type="number" name="lessonBooksAmount" />
          </label>
        </div>
        <div>
          <label>
            Ofertas:
            <input
              type="number"
              name="offeringTotal"
              min="0.00"
              step="0.01"
              placeholder="0.00"
              inputMode="decimal"
            />
          </label>
        </div>
        <div>
          <label>
            Dízimos:
            <input
              type="number"
              name="titheTotal"
              min="0.00"
              step="0.01"
              placeholder="0.00"
              inputMode="decimal"
            />
          </label>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
