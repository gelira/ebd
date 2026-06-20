import { dbGetClassroomsByCongregationId } from '@/app/_lib/db/classroom'
import { dbGetCongregation } from '@/app/_lib/db/congregation'
import { requireUser } from '@/app/_lib/services/auth'
import { parseIntParam } from '@/app/_lib/utils/params'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ congregationId: string }> }) {
  const { congregationId } = await params

  const parsedId = parseIntParam(congregationId)

  const user = await requireUser()

  const congregation = await dbGetCongregation({
    id: parsedId,
    userId: user.id
  })

  if (!congregation) {
    notFound()
  }

  const classrooms = await dbGetClassroomsByCongregationId({
    congregationId: parsedId,
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