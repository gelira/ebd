import { getPersons } from '@/app/_lib/services/person'
import { getCurrentUser } from '@/app/_lib/utils/auth'

export default async function Page() {
  const user = await getCurrentUser()

  const persons = user
    ? (await getPersons({ churchId: user.churchId }))
    : []

  if (persons.length === 0) {
    return (
      <div>
        <p>Nenhuma pessoa cadastrada</p>
      </div>
    )
  }
  
  return (
    <div>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.completeName}
          </li>
        ))}
      </ul> 
    </div>
  )
}