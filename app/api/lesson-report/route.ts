import { dbGetAttendancesByLessonReport } from '@/app/_lib/db/attendance'
import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { dbGetPersonIdListEnrolledToClassroom } from '@/app/_lib/db/enrollment'
import { dbGetLesson } from '@/app/_lib/db/lesson'
import { dbGetLessonReport } from '@/app/_lib/db/lesson-report'
import prisma from '@/app/_lib/db/prisma'
import { AttendanceTypeEnum } from '@/app/_lib/generated/prisma/client'
import { getAuthenticatedUser } from '@/app/_lib/services/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const Schema = z.object({
  lessonId: z.number().int().positive(),
  classroomId: z.number().int().positive(),
  lessonDate: z.string(),
  visitorsAmount: z.number().int().min(0),
  holyBiblesAmount: z.number().int().min(0),
  lessonBooksAmount: z.number().int().min(0),
  offeringTotal: z.number().min(0),
  titheTotal: z.number().min(0),
  attendances: z.array(
    z.object({
      personId: z.number().int().positive(),
      attendance: z.enum([
        AttendanceTypeEnum.PRESENT,
        AttendanceTypeEnum.ABSENT,
        AttendanceTypeEnum.JUSTIFIED_ABSENT
      ]),
    })
  ).min(1),
})

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const body = await request.json()

    const validation = Schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        z.treeifyError(validation.error),
        { status: 400 }
      )
    }

    const data = validation.data

    const lesson = await dbGetLesson({
      id: data.lessonId,
      churchId: user.churchId
    })

    if (!lesson || lesson.completed || lesson.term.completed) {
      return NextResponse.json(
        { message: 'Não é possível registrar diários para esta aula' },
        { status: 400 }
      )
    }

    const classroom = await dbGetClassroom({
      id: data.classroomId,
      userId: user.id,
    })

    if (!classroom) {
      return NextResponse.json(
        { message: 'Não é possível registrar diários para esta classe' },
        { status: 400 }
      )
    }

    const enrollmentPersonIdList = await dbGetPersonIdListEnrolledToClassroom({
      classroomId: classroom.id,
      termId: lesson.termId
    })

    const allEnrollmentsHaveAttendance = data.attendances.every(
      (at) => enrollmentPersonIdList.includes(at.personId)
    )

    if (!allEnrollmentsHaveAttendance) {
      return NextResponse.json(
        { message: 'Defina a presença de todas as matrículas' },
        { status: 400 }
      )
    }

    const attendanceAmount = data.attendances.reduce((acc, curr) => {
      let count = acc

      if (curr.attendance === AttendanceTypeEnum.PRESENT) {
        count = count + 1
      }

      return count
    }, 0)

    const absenceAmount = data.attendances.length - attendanceAmount

    await prisma.$transaction(async (tx) => {
      const lessonReport = await tx.lessonReport.create({
        data: {
          absenceAmount,
          attendanceAmount,
          holyBiblesAmount: data.holyBiblesAmount,
          lessonBooksAmount: data.lessonBooksAmount,
          lessonDate: new Date(data.lessonDate),
          offeringTotal: data.offeringTotal,
          titheTotal: data.titheTotal,
          visitorsAmount: data.visitorsAmount,
          classroomId: classroom.id,
          lessonId: lesson.id,
        },
        select: {
          id: true,
        },
      })

      await Promise.all(
        data.attendances.map(
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
  
    return NextResponse.json({}, { status: 200 })

  } catch {
    return NextResponse.json(
      { message: 'error to process this request'},
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const body = await request.json()

    const validation = Schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        z.treeifyError(validation.error),
        { status: 400 }
      )
    }

    const data = validation.data

    const lesson = await dbGetLesson({
      id: data.lessonId,
      churchId: user.churchId
    })

    if (!lesson || lesson.completed || lesson.term.completed) {
      return NextResponse.json(
        { message: 'Não é possível modificar este diário' },
        { status: 400 }
      )
    }

    const classroom = await dbGetClassroom({
      id: data.classroomId,
      userId: user.id,
    })

    if (!classroom) {
      return NextResponse.json(
        { message: 'Não é possível modificar este diário' },
        { status: 400 }
      )
    }

    const lessonReport = await dbGetLessonReport({
      classroomId: classroom.id,
      lessonId: lesson.id
    })

    if (!lessonReport) {
      return NextResponse.json(
        { message: 'Diário não encontrado' },
        { status: 404 }
      )
    }

    const reportAttendances = await dbGetAttendancesByLessonReport({
      lessonReportId: lessonReport.id
    })
  
    const newAttendances = reportAttendances.map((at) => {
      const newAttendance = data.attendances.find(
        (a) => a.personId === at.personId
      )
  
      return {
        id: at.id,
        attendance: newAttendance?.attendance ?? at.attendance
      }
    })
  
    const attendanceAmount = newAttendances.reduce((acc, curr) => {
      let count = acc
  
      if (curr.attendance === AttendanceTypeEnum.PRESENT) {
        count = count + 1
      }
  
      return count
    }, 0)

    const absenceAmount = newAttendances.length - attendanceAmount

    await prisma.$transaction(async (tx) => {
      await tx.lessonReport.update({
        where: {
          id: lessonReport.id
        },
        data: {
          absenceAmount,
          attendanceAmount,
          holyBiblesAmount: data.holyBiblesAmount,
          lessonBooksAmount: data.lessonBooksAmount,
          lessonDate: new Date(data.lessonDate),
          offeringTotal: data.offeringTotal,
          titheTotal: data.titheTotal,
          visitorsAmount: data.visitorsAmount,
        }
      })

      await Promise.all(
        newAttendances.map(
          (at) => tx.attendance.update({
            where: {
              id: at.id
            },
            data: {
              attendance: at.attendance,
            },
          })
        )
      )
    })

    return NextResponse.json({}, { status: 200 })

  } catch {
    return NextResponse.json(
      { message: 'error to process this request'},
      { status: 500 }
    )
  }
}