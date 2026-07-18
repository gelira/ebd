import 'server-only'
import { dbGetCongregation } from '@/app/_lib/db/congregation'
import { parseIntParam } from '@/app/_lib/utils/params'
import { notFound } from 'next/navigation'

export async function requireCongregation({ congregationId, userId }: {
  congregationId: any
  userId: number
}) {
  const parsedId = parseIntParam(congregationId)

  const congregation = await dbGetCongregation({ id: parsedId, userId })

  if (!congregation) {
    notFound()
  }

  return congregation
}