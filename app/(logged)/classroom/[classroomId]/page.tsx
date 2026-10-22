import { dbGetEnrollmentsByClassroomAndTerm } from '@/app/_lib/db/enrollment'
import { dbGetLessonsByTerm } from '@/app/_lib/db/lesson'
import { dbGetCurrentTerm } from '@/app/_lib/db/term'
import { requireUser } from '@/app/_lib/services/auth'
import { requireClassroom } from '@/app/_lib/services/classroom'
import { Alert, Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import Enrollments from './_components/enrollments'
import LessonReportDialog from './_components/lesson-report-dialog'

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

  const lessons = await dbGetLessonsByTerm({
    termId: currentTerm.id,
  })

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
        {classroom.name}
      </Typography>

      <Typography component="h2" variant="h6" sx={{ overflowWrap: 'anywhere' }}>
        {currentTerm.termName} - {currentTerm.year}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
        <Link href={`/classroom/${classroomId}/enrollments`} passHref>
          <Button
            variant="contained"
            color="success"
          >
            Nova matrícula
          </Button>
        </Link>
        <LessonReportDialog classroomId={classroom.id} lessons={lessons} />
      </Box>

      <Enrollments enrollments={enrollments} />
    </Box>
  )
}