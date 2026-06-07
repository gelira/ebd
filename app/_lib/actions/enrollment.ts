'use server'

import prisma from '@/app/_lib/db/prisma'
import { dbGetClassroom } from '@/app/_lib/db/classroom'
import { dbGetPerson } from '@/app/_lib/db/person'
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

  redirect(`/classroom/${classroomId}`)
}

export async function deleteEnrollment({ enrollmentId }: { enrollmentId: number }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

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