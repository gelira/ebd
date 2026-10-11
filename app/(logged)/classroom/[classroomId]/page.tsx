import { dbGetEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'
import { dbGetCurrentTerm } from '@/app/_lib/db/term'
import { requireUser } from '@/app/_lib/services/auth'
import { requireClassroom } from '@/app/_lib/services/classroom'
import { Alert, Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import Enrollments from './_components/enrollments'

export default async function Page({ params }: {
  params: Promise<{ classroomId: string }>
}) {
  const { classroomId } = await params

  const user = await requireUser()
  const classroom = await requireClassroom({ classroomId, userId: user.id })

  const currentTerm = await dbGetCurrentTerm({
    churchId: user.churchId
  })

  if (!currentTerm) {
    return (
      <div>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          {classroom.name}
        </Typography>
        <Alert severity="info">Não há período aberto no momento.</Alert>
      </div>
    )
  }

  const enrollments = await dbGetEnrollmentsByClassroomAndTerm({
    termId: currentTerm.id,
    classroomId: classroom.id
  })

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
        {classroom.name}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="h2" variant="h6" sx={{ overflowWrap: 'anywhere' }}>
          {currentTerm.termName} - {currentTerm.year}
        </Typography>
        <Link href={`/classroom/${classroomId}/enrollments`} passHref>
          <Button
            variant="contained"
            color="success"
          >
            Nova matrícula
          </Button>
        </Link>
      </Box>

      <Enrollments enrollments={enrollments} />
    </Box>
  )
}