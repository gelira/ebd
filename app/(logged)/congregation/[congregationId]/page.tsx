import { dbGetClassroomsByCongregationId } from '@/app/_lib/db/classroom'
import { requireUser } from '@/app/_lib/services/auth'
import { requireCongregation } from '@/app/_lib/services/congregation'
import Link from 'next/link'

export default async function Page({ params }: {
  params: Promise<{ congregationId: string }>
}) {
  const { congregationId } = await params

  const user = await requireUser()
  const congregation = await requireCongregation({
    congregationId,
    userId: user.id,
  })

  const classrooms = await dbGetClassroomsByCongregationId({
    congregationId: congregation.id,
  })

  return (
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
  )
}