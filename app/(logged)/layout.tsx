import { requireUser } from '@/app/_lib/services/auth'
import BaseLayout from './_components/base-layout'
import SideMenu from './_components/side-menu'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <BaseLayout
      user={user}
      menuElement={<SideMenu />}
    >
      {children}
    </BaseLayout>
  )
}