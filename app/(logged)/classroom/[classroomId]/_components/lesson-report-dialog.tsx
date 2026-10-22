'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

export default function LessonReportDialog({ classroomId, lessons }: {
  classroomId: number
  lessons: { id: number, lessonName: string, expectedDate: Date }[]
}) {
  const [open, setOpen] = useState(false)
  const [lessonId, setLessonId] = useState('')
  const router = useRouter()

  const closeDialog = () => {
    setOpen(false)
    setLessonId('')
  }

  const continueToLessonReport = () => {
    if (!lessonId) return

    router.push(`/classroom/${classroomId}/lesson-report/${lessonId}`)
  }

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Registro de Aula
      </Button>

      <Dialog open={open} onClose={closeDialog} fullWidth>
        <DialogTitle>Registro de Aula</DialogTitle>
        <DialogContent>
          {lessons.length > 0 ? (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="lesson-report-select-label">Aula</InputLabel>
              <Select
                labelId="lesson-report-select-label"
                id="lesson-report-select"
                value={lessonId}
                label="Aula"
                onChange={(event) => setLessonId(event.target.value)}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={String(lesson.id)}>
                    {lesson.lessonName} - {String(lesson.expectedDate.getDate()).padStart(2, '0')}/{String(lesson.expectedDate.getMonth() + 1).padStart(2, '0')}/{lesson.expectedDate.getFullYear()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <p>Não há aulas pendentes para o período atual.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Fechar</Button>
          <Button
            variant="contained"
            onClick={continueToLessonReport}
            disabled={!lessonId}
          >
            Seguir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
