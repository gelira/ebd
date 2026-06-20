import { requireUser } from '@/app/_lib/services/auth'
import SideMenu from './_components/side-menu'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <div className="flex">
      <SideMenu userId={user.id} />
      <div>
        <h2>Bem-vindo, {user.name} - {user.church.name}</h2>
        {children}
      </div>
    </div>
  )
}