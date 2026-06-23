'use server'

import prisma from '@/app/_lib/db/prisma'
import { AttendanceTypeEnum } from '@/app/_lib/generated/prisma/client'
import { requireUser } from '@/app/_lib/services/auth'
import { requireClassroom } from '@/app/_lib/services/classroom'
import { requireLesson } from '@/app/_lib/services/lesson'

export async function actionCreateLessonReport({
  attendances,
  holyBiblesAmount,
  lessonBooksAmount,
  lessonDate,
  offeringTotal,
  titheTotal,
  visitorsAmount,
  classroomId,
  lessonId
}: {
  lessonId: number
  classroomId: number
  lessonDate: string
  visitorsAmount: number
  holyBiblesAmount: number
  lessonBooksAmount: number
  offeringTotal: number
  titheTotal: number
  attendances: {
    personId: number
    attendance: AttendanceTypeEnum
  }[]
}) {
  const user = await requireUser()
  const lesson = await requireLesson({ churchId: user.churchId, lessonId })

  if (lesson.completed || lesson.term.completed) {
    return {
      ok: false,
      message: 'Não é possível registrar diários para esta aula',
    }
  }

  const classroom = await requireClassroom({ userId: user.id, classroomId })

  const enrollments = await prisma.enrollment.findMany({
    where: {
      classroomId: classroom.id,
      termId: lesson.termId,
    },
    select: {
      personId: true
    }
  })

  const enrollmentPersonIdList = enrollments.map((e) => e.personId)

  const allEnrollmentsHaveAttendance = attendances.every(
    (at) => enrollmentPersonIdList.includes(at.personId)
  )

  if (!allEnrollmentsHaveAttendance) {
    return {
      ok: false,
      message: 'Defina a presença de todas as matrículas',
    }
  }

  const attendanceAmount = attendances.reduce((acc, curr) => {
    let count = acc

    if (curr.attendance === AttendanceTypeEnum.PRESENT) {
      count = count + 1
    }

    return count
  }, 0)

  const absenceAmount = attendances.length - attendanceAmount

  try {
    await prisma.$transaction(async (tx) => {
      const lessonReport = await tx.lessonReport.create({
        data: {
          absenceAmount,
          attendanceAmount,
          holyBiblesAmount,
          lessonBooksAmount,
          lessonDate: new Date(lessonDate),
          offeringTotal,
          titheTotal,
          visitorsAmount,
          classroomId: classroom.id,
          lessonId: lesson.id,
        },
        select: {
          id: true,
        },
      })

      await Promise.all(
        attendances.map(
          (at) => tx.attendance.create({
            data: {
              lessonReportId: lessonReport.id,
              personId: at.personId,
              attendance: at.attendance,
            },
          })
        )
      )
    })
  } catch (err) {
    console.log(err)

    return {
      ok: false,
      message: (err as Error)?.message || 'Não foi possível registrar o diário'
    }
  }

  return { ok: true }
}
