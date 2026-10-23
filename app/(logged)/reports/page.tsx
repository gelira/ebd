import { dbGetLessonsByTerm } from '@/app/_lib/db/lesson'
import { dbGetLessonReportsByLesson } from '@/app/_lib/db/lesson-report'
import { dbGetCurrentTerm } from '@/app/_lib/db/term'
import { requireUser } from '@/app/_lib/services/auth'
import { Box, Typography } from '@mui/material'
import LessonSelect from './_components/lesson-select'

export default async function Page() {
  const user = await requireUser()

  const term = await dbGetCurrentTerm({ churchId: user.churchId })

  if (!term) {
    return (
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
          Relatório de Aula
        </Typography>
        <Typography component="h2" variant="h6" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
          Não há período aberto no momento
        </Typography>
      </Box>
    )
  }

  const lessons = await dbGetLessonsByTerm({ termId: term.id })

  const lessonReports = await Promise.all(
    lessons.map(async (lesson) => {
      const reports = await dbGetLessonReportsByLesson({ lessonId: lesson.id })
      return { lesson, reports }
    })
  )

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
        Relatório de Aula
      </Typography>
      <Typography component="h2" variant="h6" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
        {term.termName} - {term.year}
      </Typography>
      <LessonSelect lessons={lessons} lessonReports={lessonReports} />
    </Box>
  );
}