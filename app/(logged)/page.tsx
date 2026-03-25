import { getClassroomsOfCurrentUser } from '@/app/_lib/services/classroom'
import { getCongregationsOfCurrentUser } from '@/app/_lib/services/congregation'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const congregations = await getCongregationsOfCurrentUser()

  if (!congregations?.length) {
    const classrooms = await getClassroomsOfCurrentUser()

    if (classrooms?.length) {
      if (classrooms.length === 1) {
        redirect(`/classroom/${classrooms[0].id}`)
      } else {
        redirect('/classroom')
      }
    }
  }

  if (congregations?.length === 1) {
    redirect(`/congregation/${congregations[0].id}`)
  }

  return (
    <div>
      {!congregations?.length ? (
        <h1>Você não está vinculado a nenhuma congregação ou classe</h1>
      ) : (
        <>
          <h1>Escolha uma congregação</h1>
          {congregations.map((congregation) => (
            <Link
              href={`/congregation/${congregation.id}`}
              key={congregation.id}
            >
              {congregation.name}
            </Link>
          ))}
        </>
      )}
    </div>
  )
}
