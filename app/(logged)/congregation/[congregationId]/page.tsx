import { getCurrentCongregation } from '@/app/_lib/services/congregation'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ congregationId: string }> }) {
  const { congregationId } = await params

  const congregation = await getCurrentCongregation(Number(congregationId))

  if (!congregation) {
    notFound()
  }

  return (
    <div>
      <h1>{congregation.name}</h1>
    </div>
  )
}