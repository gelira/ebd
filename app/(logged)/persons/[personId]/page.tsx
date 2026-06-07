import { dbGetPerson } from '@/app/_lib/db/person'
import { getCurrentUser } from '@/app/_lib/services/auth'
import { parseIntParam } from '@/app/_lib/utils/params'
import { notFound } from 'next/navigation'

import PersonForm from './_components/form'

export default async function Page({ params }: { params: Promise<{ personId: string }> }) {
  const user = await getCurrentUser()

  const churchId = user?.churchId ?? 0
  
  const { personId } = await params

  const newPerson = personId === 'new'
  const personIdNumber = Number(personId)

  const person = await (async () => {
    if (newPerson) {
      return null
    }

    const parsedId = parseIntParam(personId)

    const person = await dbGetPerson({ id: parsedId, churchId })

    if (!person) {
      notFound()
    }

    return person
  })()

  return (
    <PersonForm person={person} />
  )
}