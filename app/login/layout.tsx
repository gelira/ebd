import { getCurrentUser } from '@/app/_lib/services/auth'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (user) {
    return redirect('/')
  }

  return (
    <div className="flex justify-center items-center px-5 h-screen">
      <div className="w-full max-w-xs">
        <h2 className="text-3xl font-bold text-center">Sistema EBD</h2>
        {children}
      </div>
    </div>
  )
}
