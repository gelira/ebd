'use server'

import prisma from '@/app/_lib/db/prisma'
import { getCurrentUser } from '@/app/_lib/services/auth'
import { parseDateString } from '@/app/_lib/utils/date'
import { redirect } from 'next/navigation'

export async function createPerson({ completeName, birthDate }: { completeName: string, birthDate: string }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  await prisma.person.create({
    data: {
      completeName,
      birthDate: parseDateString(birthDate),
      churchId: user.churchId,
    },
  })

  redirect('/persons')
}

export async function updatePerson({ id, completeName, birthDate }: { id: number, completeName: string, birthDate: string }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  await prisma.person.update({
    where: { id, churchId: user.churchId },
    data: {
      completeName,
      birthDate: parseDateString(birthDate),
    }
  })

  redirect('/persons')
}
