import { dbGetCongregationsByUserId } from '@/app/_lib/db/congregation'
import Link from 'next/link'

export default async function SideMenu({ userId }: { userId: number }) {
  const congregations = await dbGetCongregationsByUserId({ userId })

  return (
    <div className="mr-8">
      <ul>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        <li>
          <Link href="/persons">
            Lista de pessoas
          </Link>
        </li>
        <li>
          <Link href="/persons/new">
            Cadastrar pessoa
          </Link>
        </li>
        {congregations.map((congregation) => (
          <li key={congregation.id}>
            <Link href={`/congregation/${congregation.id}`}>
              {congregation.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}