import { getClassroomsOfCurrentCongregation } from '@/app/_lib/services/classroom'
import { getCurrentCongregation } from '@/app/_lib/services/congregation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ congregationId: string }> }) {
  const { congregationId } = await params

  const congregation = await getCurrentCongregation(Number(congregationId))

  if (!congregation) {
    notFound()
  }

  const classrooms = await getClassroomsOfCurrentCongregation(congregation.id)

  return (
    <div className="m-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Classes - {congregation.name}</h2>
          {classrooms?.map((classroom) => (
            <Link
              key={classroom.id}
              href={`/classroom/${classroom.id}`}
            >
              <button className="btn btn-outline w-full">{classroom.name}</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}