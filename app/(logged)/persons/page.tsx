import { getPersons } from '@/app/_lib/db/person'
import { getCurrentUser } from '@/app/_lib/services/auth'
import Link from 'next/link'

export default async function Page() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const persons = await getPersons({ churchId: user.churchId })

  if (persons.length === 0) {
    return (
      <div>
        <p>Nenhuma pessoa cadastrada</p>
        <Link href="/persons/new">Cadastrar nova pessoa</Link>
      </div>
    )
  }
  
  return (
    <div>
      <ul>
        {persons.map((person) => {
          const birthDate = person.birthDate
            ? new Date(person.birthDate).toISOString().split('T')[0]
            : 'Sem data de nascimento'
          
          return (
            <li key={person.id}>
              <div>
                <p>{person.completeName} - {birthDate}</p>
                <Link href={`/persons/${person.id}`}>Editar</Link>
              </div>
            </li>
          )
        })}
      </ul> 
      <Link href="/persons/new">Cadastrar nova pessoa</Link>
    </div>
  )
}