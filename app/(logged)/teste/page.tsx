import { getCurrentUser } from '@/app/_lib/utils/auth'

export default async function Page() {
  const user = await getCurrentUser()

  return (
    <div>
      <h1>{user?.role}</h1>
    </div>
  )
}