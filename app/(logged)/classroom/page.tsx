import { Classroom, Congregation } from '@/app/_lib/generated/prisma/client'
import { getClassroomsOfCurrentUser } from '@/app/_lib/services/classroom'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

  if (classrooms.length === 1) {
    redirect(`/classroom/${classrooms[0].id}`)
  }

  const reducedClassrooms = classrooms.reduce<{ congregation: Congregation, classrooms: Classroom[] }[]>(
    (acc, classroom) => {
      const item = acc.find((item) => item.congregation.id === classroom.congregationId)

      if (item) {
        item.classrooms.push(classroom)
      } else {
        acc.push({
          congregation: classroom.congregation,
          classrooms: [classroom],
        })
      }

      return acc
    },
    []
  )

  return (
    <div>
      <h1>Classes</h1>
      {reducedClassrooms.map((item) => (
        <div key={item.congregation.id}>
          <h2>{item.congregation.name}</h2>
          {item.classrooms.map((classroom) => (
            <Link
              key={classroom.id}
              href={`/classroom/${classroom.id}`}
            >
              {classroom.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}