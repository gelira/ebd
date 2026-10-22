'use client'

import type { AttendanceTypeEnum, LessonReport } from '@/app/_lib/generated/prisma/client'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { SubmitEvent, useCallback, useState } from 'react'
import Attendance from './attedance'

export default function RegisterLessonReport({
  existingReport,
  completed,
  enrollments,
  classroomId,
  lessonId,
  lessonReport,
}: {
  existingReport: boolean
  completed: boolean
  enrollments: {
    personId: number
    completeName: string
    attendance?: AttendanceTypeEnum
  }[]
  lessonReport: LessonReport | null
  classroomId: number
  lessonId: number
}) {
  const [lessonDate, setLessonDate] = useState(() => {
    if (!existingReport) {
      return new Date().toISOString().slice(0, 10)
    }
    return lessonReport?.lessonDate ? lessonReport.lessonDate.toISOString().slice(0, 10) : ''
  })
  const [visitorsAmount, setVisitorsAmount] = useState<number | undefined>(
    lessonReport?.visitorsAmount
  )
  const [holyBiblesAmount, setHolyBiblesAmount] = useState<number | undefined>(
    lessonReport?.holyBiblesAmount
  )
  const [lessonBooksAmount, setLessonBooksAmount] = useState<number | undefined>(
    lessonReport?.lessonBooksAmount
  )
  const [offeringTotal, setOfferingTotal] = useState(
    lessonReport?.offeringTotal.toFixed(2) ?? ''
  )
  const [titheTotal, setTitheTotal] = useState(
    lessonReport?.titheTotal.toFixed(2) ?? ''
  )
  const [attendances, setAttendances] = useState<{
    personId: number
    attendance: AttendanceTypeEnum
  }[]>(() =>
    enrollments
      .filter((e): e is typeof e & { attendance: AttendanceTypeEnum } => Boolean(e.attendance))
      .map((e) => ({
        personId: e.personId,
        attendance: e.attendance,
      }))
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [pending, setPending] = useState(false)

  const router = useRouter()

  const onAttendanceChange = useCallback(
    (personId: number, attendance: AttendanceTypeEnum) => {
      setAttendances((prev) => {
        const existing = prev.some((att) => att.personId === personId)

        if (!existing) {
          return [...prev, { personId, attendance }]
        }

        return prev.map((att) =>
          att.personId === personId
            ? { ...att, attendance }
            : att
        )
      })
    },
    []
  )

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (completed) {
      return
    }

    if (
      holyBiblesAmount === undefined ||
      lessonBooksAmount === undefined ||
      visitorsAmount === undefined ||
      offeringTotal === '' ||
      titheTotal === '' ||
      !lessonDate
    ) {
      return
    }

    const parsedOfferingTotal = Number(offeringTotal)
    const parsedTitheTotal = Number(titheTotal)
    if (
      !Number.isFinite(parsedOfferingTotal) ||
      parsedOfferingTotal < 0 ||
      !Number.isFinite(parsedTitheTotal) ||
      parsedTitheTotal < 0
    ) {
      setErrorMessage('Informe valores válidos para dízimos e ofertas')
      return
    }

    if (enrollments.length > 0 && attendances.length < enrollments.length) {
      setErrorMessage('Defina a presença de todas as matrículas')
      return
    }

    setPending(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/lesson-report', {
        method: lessonReport ? 'PUT' : 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          attendances,
          classroomId,
          holyBiblesAmount,
          lessonBooksAmount,
          lessonDate,
          lessonId,
          offeringTotal: parsedOfferingTotal,
          titheTotal: parsedTitheTotal,
          visitorsAmount
        })
      })

      if (response.ok) {
        return router.push(`/classroom/${classroomId}`)
      }

      const data = await response.json()
      setErrorMessage(data.message || 'Erro ao registrar diário. Tente novamente.')
    } catch (e) {
      console.log('erro', e)
      setErrorMessage('Algo deu errado. Tente novamente.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 800, width: '100%', mt: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack component="form" onSubmit={onSubmit} spacing={3}>
          <TextField
            label="Data da aula"
            type="date"
            name="lessonDate"
            value={lessonDate}
            onChange={(e) => {
              if (completed) {
                return
              }

              setErrorMessage('')
              setLessonDate(e.target.value)
            }}
            slotProps={{
              input: { readOnly: completed },
              inputLabel: { shrink: true },
            }}
            onClick={completed ? (event) => event.preventDefault() : undefined}
            required
            fullWidth
          />

          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Frequência
            </Typography>
            <Paper variant="outlined" sx={{ px: 2, py: 0.5, borderRadius: 2 }}>
              {enrollments.length > 0 ? (
                enrollments.map((e) => {
                  const currentAttendance =
                    attendances.find((att) => att.personId === e.personId)?.attendance ?? e.attendance

                  return (
                    <Attendance
                      key={e.personId}
                      personId={e.personId}
                      completeName={e.completeName}
                      attendance={currentAttendance}
                      onChange={onAttendanceChange}
                      readOnly={completed}
                    />
                  )
                })
              ) : (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  Nenhum aluno matriculado nesta classe.
                </Typography>
              )}
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações da aula
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField
                label="Quantidade de visitantes"
                type="number"
                name="visitorsAmount"
                placeholder="0"
                value={visitorsAmount !== undefined ? visitorsAmount : ''}
                onChange={(e) => {
                  if (completed) {
                    return
                  }

                  setErrorMessage('')
                  const val = e.target.value
                  setVisitorsAmount(val === '' ? undefined : parseInt(val, 10))
                }}
                slotProps={{
                  input: { readOnly: completed },
                  htmlInput: { min: 0 },
                }}
                required
                fullWidth
              />

              <TextField
                label="Quantidade de bíblias"
                type="number"
                name="holyBiblesAmount"
                placeholder="0"
                value={holyBiblesAmount !== undefined ? holyBiblesAmount : ''}
                onChange={(e) => {
                  if (completed) {
                    return
                  }

                  setErrorMessage('')
                  const val = e.target.value
                  setHolyBiblesAmount(val === '' ? undefined : parseInt(val, 10))
                }}
                slotProps={{
                  input: { readOnly: completed },
                  htmlInput: { min: 0 },
                }}
                required
                fullWidth
              />

              <TextField
                label="Quantidade de lições"
                type="number"
                name="lessonBooksAmount"
                placeholder="0"
                value={lessonBooksAmount !== undefined ? lessonBooksAmount : ''}
                onChange={(e) => {
                  if (completed) {
                    return
                  }

                  setErrorMessage('')
                  const val = e.target.value
                  setLessonBooksAmount(val === '' ? undefined : parseInt(val, 10))
                }}
                slotProps={{
                  input: { readOnly: completed },
                  htmlInput: { min: 0 },
                }}
                required
                fullWidth
              />

              <TextField
                label="Ofertas"
                type="text"
                name="offeringTotal"
                placeholder="0.00"
                value={offeringTotal}
                onChange={(e) => {
                  if (completed) {
                    return
                  }

                  setErrorMessage('')
                  setOfferingTotal(e.target.value)
                }}
                onBlur={() => {
                  const amount = Number(offeringTotal)
                  if (offeringTotal !== '' && Number.isFinite(amount)) {
                    setOfferingTotal(amount.toFixed(2))
                  }
                }}
                slotProps={{
                  input: {
                    readOnly: completed,
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  },
                  htmlInput: {
                    min: '0.00',
                    step: '0.01',
                    inputMode: 'decimal',
                  },
                }}
                required
                fullWidth
              />

              <TextField
                label="Dízimos"
                type="text"
                name="titheTotal"
                placeholder="0.00"
                value={titheTotal}
                onChange={(e) => {
                  if (completed) {
                    return
                  }

                  setErrorMessage('')
                  setTitheTotal(e.target.value)
                }}
                onBlur={() => {
                  const amount = Number(titheTotal)
                  if (titheTotal !== '' && Number.isFinite(amount)) {
                    setTitheTotal(amount.toFixed(2))
                  }
                }}
                slotProps={{
                  input: {
                    readOnly: completed,
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  },
                  htmlInput: {
                    min: '0.00',
                    step: '0.01',
                    inputMode: 'decimal',
                  },
                }}
                required
                fullWidth
              />
            </Box>
          </Box>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {!completed && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={pending}
              >
                {pending ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
