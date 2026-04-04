'use server'

import prisma from '@/app/_lib/db/prisma'
import { getClassroom } from '@/app/_lib/db/classroom'
import { getCurrentUser } from '@/app/_lib/services/auth'
import { getTerm } from '@/app/_lib/db/term'
import { redirect } from 'next/navigation'

export async function createEnrollments({ personIdList, classroomId, termId, enrollmentType }: {
  termId: number,
  personIdList: number[],
  classroomId: number,
  enrollmentType: 'STUDENT' | 'TEACHER',
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const term = await getTerm({ id: termId, churchId: user.churchId })

  if (!term || term.completed) {
    return {
      ok: false,
      message: 'Período não encontrado'
    }
  }

  const classroom = await getClassroom({ id: classroomId, userId: user.id })

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

  redirect(`/classroom/${classroomId}`)
}