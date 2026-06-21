import { redirect } from 'next/navigation'

export default async function Page({ params }: {
  params: Promise<{ classroomId: string }>
}) {
  const { classroomId } = await params

  redirect(`/classroom/${classroomId}`)
}