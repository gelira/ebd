'use client'

import { actionCreateLessonReport } from '@/app/_lib/actions/lesson-report'
import { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import type { AttendanceTypeEnum } from '@/app/_lib/generated/prisma/client'
import { useRouter } from 'next/navigation'
import { SubmitEvent, useCallback, useState } from 'react'
import Attendance from './attedance'

export default function RegisterLessonReport({
  enrollments,
  classroomId,
  lessonId,
}: {
  enrollments: EnrollmentWithPerson[]
  classroomId: number
  lessonId: number
}) {
  const [visitorsAmount, setVisitorsAmount] = useState(0)
  const [holyBiblesAmount, setHolyBiblesAmount] = useState(0)
  const [lessonBooksAmount, setLessonBooksAmount] = useState(0)
  const [offeringTotal, setOfferingTotal] = useState(0)
  const [titheTotal, setTitheTotal] = useState(0)
  const [attendances, setAttendances] = useState<{
    personId: number
    attendance: AttendanceTypeEnum
  }[]>([])

  const router = useRouter()

  const onAttendanceChange = useCallback(
    (personId: number, attendance: AttendanceTypeEnum) => {
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

    const lessonDate = formData.get('lessonDate') as string

    const { ok, message } = await actionCreateLessonReport({
      attendances,
      classroomId,
      holyBiblesAmount,
      lessonBooksAmount,
      lessonDate,
      lessonId,
      offeringTotal,
      titheTotal,
      visitorsAmount
    })

    if (ok) {
      router.push(`/classroom/${classroomId}`)

      return
    }

    console.log('erro', message)
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
            <input
              type="number"
              name="visitorsAmount"
              placeholder="0"
              onChange={(e) => setVisitorsAmount(parseInt(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Quantidade de bíblias:
            <input
              type="number"
              name="holyBiblesAmount"
              placeholder="0"
              onChange={(e) => setHolyBiblesAmount(parseInt(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Quantidade de lições:
            <input
              type="number"
              name="lessonBooksAmount"
              placeholder="0"
              onChange={(e) => setLessonBooksAmount(parseInt(e.target.value))}
              required
            />
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
              onChange={(e) => setOfferingTotal(parseFloat(e.target.value))}
              required
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
              onChange={(e) => setTitheTotal(parseFloat(e.target.value))}
              required
            />
          </label>
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
