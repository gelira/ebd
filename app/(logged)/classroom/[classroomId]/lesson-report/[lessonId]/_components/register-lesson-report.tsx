'use client'

import type { AttendanceTypeEnum, LessonReport } from '@/app/_lib/generated/prisma/client'
import { useRouter } from 'next/navigation'
import { SubmitEvent, useCallback, useState } from 'react'
import Attendance from './attedance'

export default function RegisterLessonReport({
  enrollments,
  classroomId,
  lessonId,
  lessonReport,
}: {
  enrollments: {
    personId: number
    completeName: string
    attendance?: AttendanceTypeEnum
  }[]
  lessonReport: LessonReport | null
  classroomId: number
  lessonId: number
}) {
  const [lessonDate, setLessonDate] = useState(lessonReport?.lessonDate.toISOString().slice(0, 10))
  const [visitorsAmount, setVisitorsAmount] = useState(lessonReport?.visitorsAmount)
  const [holyBiblesAmount, setHolyBiblesAmount] = useState(lessonReport?.holyBiblesAmount)
  const [lessonBooksAmount, setLessonBooksAmount] = useState(lessonReport?.lessonBooksAmount)
  const [offeringTotal, setOfferingTotal] = useState(lessonReport?.offeringTotal)
  const [titheTotal, setTitheTotal] = useState(lessonReport?.titheTotal)
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

    if (
      holyBiblesAmount === undefined ||
      lessonBooksAmount === undefined ||
      visitorsAmount === undefined ||
      offeringTotal === undefined ||
      titheTotal === undefined ||
      !lessonDate
    ) {
      return
    }

    try {
      const response = await fetch('/api/lesson-report', {
        method: lessonReport ? 'PUT' : 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
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
      })

      if (response.ok) {
        return router.push(`/classroom/${classroomId}`)
      }

      const data = await response.json()

      console.log('erro', data)

    } catch (e) {
      console.log('erro', e)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Data da aula:
            <input
              type="date"
              name="lessonDate"
              value={lessonDate}
              onChange={(e) => setLessonDate(e.target.value)}
              required
            />
          </label>
        </div>
        {enrollments.map((e) => (
          <Attendance
            key={e.personId}
            personId={e.personId}
            completeName={e.completeName}
            attendance={e.attendance}
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
              value={visitorsAmount}
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
              value={holyBiblesAmount}
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
              value={lessonBooksAmount}
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
              value={offeringTotal}
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
              value={titheTotal}
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
