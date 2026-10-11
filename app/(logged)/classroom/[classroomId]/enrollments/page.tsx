import { dbGetPersonsWithoutEnrollmentsInClassroom } from '@/app/_lib/db/person'
import { dbGetCurrentTerm } from '@/app/_lib/db/term'
import { requireUser } from '@/app/_lib/services/auth'
import { requireClassroom } from '@/app/_lib/services/classroom'
import { Box, Typography } from '@mui/material'
import PersonSelect from '../_components/person-select'

export default async function Page({ params }: {
  params: Promise<{ classroomId: string }>
}) {
  const { classroomId } = await params
  
  const user = await requireUser()
  const classroom = await requireClassroom({ classroomId, userId: user.id })

  const term = await dbGetCurrentTerm({
    churchId: user.churchId
  })

  const persons = term && await dbGetPersonsWithoutEnrollmentsInClassroom({
    classroomId: classroom.id,
    churchId: term.churchId,
    termId: term.id,
  })

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
        Nova Matrícula
      </Typography>
      <Typography component="h2" variant="h6" sx={{ mb: 2, overflowWrap: 'anywhere' }}>
        {classroom.name} - {term
          ? `${term.termName} - ${term.year}`
          : 'Não há período aberto no momento'}
      </Typography>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body gap-4">
          <PersonSelect
            classroomId={classroom.id}
            termId={term?.id}
            persons={persons ?? []}
          />
        </div>
      </div>
    </Box>
  )
}