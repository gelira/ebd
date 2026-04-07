import { getCurrentUser } from '@/app/_lib/services/auth'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main>
      <nav className="navbar bg-base-100 px-4 shadow-sm">
        <h2 className="text-xl">Sistema EBD</h2>
      </nav>
      <div className="max-w-7xl mx-auto">
        <div className="p-2">
          <div className="badge badge-neutral">
            {user.church.name}
          </div>
        </div>
        <div className="m-4">
          {children}
        </div>
      </div>
    </main>
  )
}