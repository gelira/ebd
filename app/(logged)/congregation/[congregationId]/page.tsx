import { getCongregation } from '@/app/_lib/db/congregation'
import { getCurrentUser } from '@/app/_lib/services/auth'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ congregationId: string }> }) {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }
  
  const { congregationId } = await params

  const congregation = await (async () => {
    const id = Number(congregationId)

    if (isNaN(id)) {
      return null
    }

    return await getCongregation({ id, userId: user.id })
  })()

  if (!congregation) {
    notFound()
  }

  return (
    <div>
      <h1>{congregation.name}</h1>
    </div>
  )
}