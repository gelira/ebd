import { dbGetPersons } from '@/app/_lib/db/person'
import { getCurrentUser } from '@/app/_lib/services/auth'
import Link from 'next/link'
import PersonItem from './_components/person-item'

export default async function Page() {
  const user = await getCurrentUser()

  const persons = await dbGetPersons({
    churchId: user?.churchId ?? 0
  })

  return (
    <div>
      <Link href="/persons/new">Cadastrar nova pessoa</Link>
      {persons.length === 0 ? (
        <p>Nenhuma pessoa cadastrada</p>
      ) : (
        <>
          {persons.map((person) => (
            <PersonItem key={person.id} person={person} />
          ))}
        </>
      )}
    </div>
  )
}