import { getCongregationsByUserId } from '@/app/_lib/db/congregation'
import { getCurrentUser } from '@/app/_lib/services/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const congregations = await getCongregationsByUserId(user.id)

  if (congregations.length === 1) {
    redirect(`/congregation/${congregations[0].id}`)
  }

  return (
    <div>
      {congregations.length === 0 ? (
        <h1>Você não está vinculado a nenhuma congregação</h1>
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
