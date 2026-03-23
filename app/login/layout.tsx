import { getCurrentUser } from '@/app/_lib/services/auth'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (user) {
    return redirect('/')
  }

  return (
    <main>
      <h2>EBD - Página de Login</h2>
      {children}
    </main>
  )
}