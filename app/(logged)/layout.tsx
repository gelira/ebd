import { getCurrentUser } from '@/app/_lib/utils/auth'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <main>
      <h2>EBD - Home</h2>
      <h3>Olá, {user.name}</h3>
      {children}
    </main>
  )
}