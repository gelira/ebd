import { requireUser } from '@/app/_lib/services/auth'
import { requireClassroom } from '@/app/_lib/services/classroom'
import ClassroomBreadcrumbs from './_components/breadcrumbs'

export default async function Layout({ children, params }: {
  children: React.ReactNode,
  params: Promise<{ classroomId: string }> 
}) {
  const { classroomId } = await params
  
  const user = await requireUser()
  const classroom = await requireClassroom({ classroomId, userId: user.id })

  return (
    <>
      <ClassroomBreadcrumbs classroom={classroom} />
      {children}
    </>
  )
}