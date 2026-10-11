'use client'

import type { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import { useCallback, useState, useTransition } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import Enrollment from './enrollment'

export default function Enrollments(props: {
  enrollments: EnrollmentWithPerson[]
}) {
  const [enrollments, setEnrollments] = useState(props.enrollments)
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithPerson | null>(null)
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()

  const openDeleteDialog = useCallback((enrollment: EnrollmentWithPerson) => {
    setMessage('')
    setSelectedEnrollment(enrollment)
  }, [])

  const closeDeleteDialog = () => {
    if (!pending) {
      setSelectedEnrollment(null)
      setMessage('')
    }
  }

  const deleteEnrollment = () => {
    if (!selectedEnrollment) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/enrollments/${selectedEnrollment.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setEnrollments((prev) => prev.filter((e) => e.id !== selectedEnrollment.id))
          setSelectedEnrollment(null)
          return
        }

        const data = await response.json()
        setMessage(data.message || 'Erro ao excluir matrícula. Tente novamente')
      } catch {
        setMessage('Erro ao excluir matrícula. Tente novamente')
      }
    })
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ width: '100%', maxWidth: '100%', minWidth: 0, borderRadius: 2, overflowX: 'auto' }}
      >
        <Table sx={{ minWidth: 480 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nome do aluno</TableCell>
              <TableCell
                align="right"
                sx={{
                  position: 'sticky',
                  right: 0,
                  zIndex: 2,
                  width: 120,
                  minWidth: 120,
                  backgroundColor: 'background.paper',
                  fontWeight: 600,
                }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <Enrollment
                  key={enrollment.id}
                  enrollment={enrollment}
                  deletedCallback={openDeleteDialog}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>Nenhuma matrícula para o período atual</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={selectedEnrollment !== null}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-enrollment-title"
        aria-describedby="delete-enrollment-description"
      >
        <DialogTitle id="delete-enrollment-title">Excluir matrícula?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-enrollment-description">
            Tem certeza de que deseja excluir a matrícula de{' '}
            {selectedEnrollment?.person.completeName}?
          </DialogContentText>
          {message && (
            <DialogContentText color="error" sx={{ mt: 2 }}>
              {message}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={pending}>
            Cancelar
          </Button>
          <Button onClick={deleteEnrollment} color="error" disabled={pending}>
            {pending ? 'Excluindo...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}