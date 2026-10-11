import { Breadcrumbs } from '@mui/material'
import Link from 'next/link'
import { ClassroomWithCongregation } from '@/app/_lib/db/classroom'

export default function ClassroomBreadcrumbs({ classroom }: {
  classroom: ClassroomWithCongregation
}) {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ '& a': { textDecoration: 'none', color: 'inherit' } }}
    >
      <Link href={`/congregation/${classroom?.congregation.id}`}>
        {classroom?.congregation.name}
      </Link>
      <Link href={`/classroom/${classroom?.id}`}>
        {classroom?.name}
      </Link>
    </Breadcrumbs>
  )
}