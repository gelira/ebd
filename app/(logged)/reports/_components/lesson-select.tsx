'use client'

import { useState } from 'react'
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import type { LessonReportsByLesson } from '@/app/_lib/db/lesson-report'
import type { Lesson } from '@/app/_lib/generated/prisma/client'

type LessonOption = {
  lesson: Lesson
  reports: LessonReportsByLesson
}

export default function LessonSelect({ lessonReports, lessons }: {
  lessons: Lesson[]
  lessonReports: LessonOption[]
}) {
  const [lessonId, setLessonId] = useState('')
  const [classroomId, setClassroomId] = useState('')

  const selectedLesson = lessons.find((lesson) => String(lesson.id) === lessonId)
  const selectedReports = lessonReports.find((lr) => lr.lesson.id === selectedLesson?.id)?.reports ?? []
  const classrooms = selectedReports.map((report) => report.classroom)
  const reportsToSummarize = classroomId === 'general'
    ? selectedReports
    : selectedReports.filter((report) => String(report.classroomId) === classroomId)

  const attendances = reportsToSummarize.flatMap((report) => report.attendances)

  const enrolled = new Set(attendances.map((attendance) => attendance.personId)).size

  const present = attendances.reduce(
    (acc, attendance) => {
      if (!acc.personIds.has(attendance.personId) && attendance.attendance === 'PRESENT') {
        acc.count += 1
        acc.personIds.add(attendance.personId)
      }

      return acc
    },
    { count: 0, personIds: new Set<number>() }
  ).count

  const kpis = reportsToSummarize.reduce((totals, report) => ({
    visitors: totals.visitors + report.visitorsAmount,
    bibles: totals.bibles + report.holyBiblesAmount,
    books: totals.books + report.lessonBooksAmount,
    offerings: totals.offerings + report.offeringTotal,
    tithes: totals.tithes + report.titheTotal,
  }), {
    visitors: 0,
    bibles: 0,
    books: 0,
    offerings: 0,
    tithes: 0,
  })

  const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)

  const kpiItems = [
    { label: 'Matriculados', value: enrolled },
    { label: 'Presentes', value: present },
    { label: 'Ausentes', value: enrolled - present },
    { label: 'Visitantes', value: kpis.visitors },
    { label: 'Frequência total', value: present + kpis.visitors },
    { label: 'Bíblias', value: kpis.bibles },
    { label: 'Revistas', value: kpis.books },
    { label: 'Ofertas', value: formatCurrency(kpis.offerings) },
    { label: 'Dízimos', value: formatCurrency(kpis.tithes) },
  ]

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="lesson-select-label">Aula</InputLabel>
        <Select
          labelId="lesson-select-label"
          id="lesson-select"
          label="Aula"
          value={lessonId}
          onChange={(event) => {
            setLessonId(event.target.value)
            setClassroomId('')
          }}
        >
          <MenuItem value="" disabled>
            {lessons.length > 0 ? 'Selecione uma aula' : 'Nenhuma aula disponível'}
          </MenuItem>
          {lessons.map((lesson) => (
            <MenuItem key={lesson.id} value={String(lesson.id)}>
              {lesson.lessonName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedLesson && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="classroom-select-label">Classe</InputLabel>
          <Select
            labelId="classroom-select-label"
            id="classroom-select"
            label="Classe"
            value={classroomId}
            onChange={(event) => setClassroomId(event.target.value)}
          >
            <MenuItem value="" disabled>
              Selecione uma classe
            </MenuItem>
            <MenuItem value="general">Geral</MenuItem>
            {classrooms.map((classroom) => (
              <MenuItem key={classroom.id} value={String(classroom.id)}>
                {classroom.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {classroomId && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: 2,
            mt: 2,
          }}
        >
          {kpiItems.map(({ label, value }) => (
            <Card key={label}>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  {label}
                </Typography>
                <Typography component="p" variant="h5" sx={{ mt: 1 }}>
                  {value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </>
  )
}
