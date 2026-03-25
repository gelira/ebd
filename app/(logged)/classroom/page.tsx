import { getClassroomsOfCurrentUser } from '@/app/_lib/services/classroom'
import Link from 'next/link'

export default async function Page() {
  const classrooms = await getClassroomsOfCurrentUser()

  if (!classrooms) {
    return null
  }

  if (classrooms.length === 0) {
    return (
      <div>
        <h1>Você não está em nenhuma classe</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>Classes</h1>
      {classrooms.map((classroom) => (
        <div key={classroom.id}>
          <Link
            href={`/classroom/${classroom.id}`}
          >
            {classroom.name}
          </Link>
        </div>
      ))}
    </div>
  )
}