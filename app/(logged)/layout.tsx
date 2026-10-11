import prisma from '@/app/_lib/db/prisma'
import { requireUser } from '@/app/_lib/services/auth'

import BaseLayout from './_components/base-layout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  const congregations = await prisma.congregation.findMany({
    where: {
      usersCongregation: {
        some: {
          userId: user.id,
        },
      },
    },
  })

  return (
    <BaseLayout congregations={congregations} user={user}>
      {children}
    </BaseLayout>
  )
}