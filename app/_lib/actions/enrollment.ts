'use server'

import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { dbGetPerson } from '@/app/_lib/db/person'
import prisma from '@/app/_lib/db/prisma'
import { requireUser } from '@/app/_lib/services/auth'

export async function actionCreateEnrollments({ personIdList, classroomId, termId, enrollmentType }: {
  termId: number
  classroomId: number
  personIdList: number[]
  enrollmentType: 'STUDENT' | 'TEACHER'
}) {
  const user = await requireUser()

  const term = await prisma.term.findFirst({
    where: {
      id: termId,
      churchId: user.churchId,
    },
  })

  if (!term || term.completed) {
    return {
      ok: false,
      message: 'Período não encontrado'
    }
  }

  const classroom = await dbGetClassroom({ id: classroomId, userId: user.id })

  if (!classroom) {
    return {
      ok: false,
      message: 'Classe não encontrada'
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        personIdList.map(async (personId) => {
          const person = await dbGetPerson({ id: personId, churchId: user.churchId })

          if (!person) {
            throw new Error('Person not found')
          }

          return await tx.enrollment.upsert({
            where: {
              personId_classroomId_termId: {
                personId,
                classroomId,
                termId,
              }
            },
            update: {
              enrollmentType,
            },
            create: {
              personId,
              classroomId,
              termId,
              enrollmentType,
            }
          })
        })
      )
    })
  } catch (err) {
    return {
      ok: false,
      message: (err as Error)?.message || 'Não foi possível registrar as matrículas'
    }
  }

  return { ok: true }
}

export async function actionDeleteEnrollment({ enrollmentId }: {
  enrollmentId: number
}) {
  const user = await requireUser()

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: enrollmentId,
      term: {
        churchId: user.churchId,
      },
    },
  })

  if (!enrollment) {
    return {
      ok: false,
      message: 'Matrícula não encontrada'
    }
  }
  
  await prisma.enrollment.delete({
    where: { id: enrollmentId },
  })

  return {
    ok: true
  }
}