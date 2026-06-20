'use server'

import prisma from '@/app/_lib/db/prisma'
import { requireUser } from '@/app/_lib/services/auth'
import { parseDateString } from '@/app/_lib/utils/date'

export async function actionCreatePerson({ completeName, birthDate }: {
  completeName: string
  birthDate: string
}) {
  const user = await requireUser()

  await prisma.person.create({
    data: {
      completeName,
      birthDate: parseDateString(birthDate),
      churchId: user.churchId,
    },
  })
}

export async function actionUpdatePerson({ id, completeName, birthDate }: {
  id: number
  completeName: string
  birthDate: string
}) {
  const user = await requireUser()

  await prisma.person.update({
    where: { id, churchId: user.churchId },
    data: {
      completeName,
      birthDate: parseDateString(birthDate),
    }
  })
}
