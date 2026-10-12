import { requireUser } from '@/app/_lib/services/auth'
import { dbCachedGetUserCongregations } from '@/app/_lib/db/congregation'

import BaseLayout from './_components/base-layout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  const congregations = await dbCachedGetUserCongregations(user.id)

  return (
    <BaseLayout congregations={congregations} user={user}>
      {children}
    </BaseLayout>
  )
}