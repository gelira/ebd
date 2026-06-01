import { getCurrentUser } from '@/app/_lib/services/auth'
import { redirect } from 'next/navigation'
import SideMenu from './_components/side-menu'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex">
      <SideMenu />
      <div>
        <h2>Bem-vindo, {user.name} - {user.church.name}</h2>
        {children}
      </div>
    </div>
  )
}