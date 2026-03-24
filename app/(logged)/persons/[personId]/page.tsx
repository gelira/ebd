import { getPerson } from '@/app/_lib/db/person'
import { getCurrentUser } from '@/app/_lib/services/auth'
import { notFound } from 'next/navigation'

import PersonForm from './_components/form'

export default async function Page({ params }: { params: Promise<{ personId: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }
  
  const { personId } = await params

  const newPerson = personId === 'new'
  const personIdNumber = Number(personId)

  const person = await (async () => {
    if (newPerson) {
      return null
    }

    if (isNaN(personIdNumber)) {
      notFound()
    }

    const person = await getPerson({ id: personIdNumber, churchId: user.churchId })

    if (!person) {
      notFound()
    }

    return person
  })()

  return (
    <PersonForm person={person} />
  )
}