'use client'

import type { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Button, IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import { useState, useTransition } from 'react'

export default function Enrollment({ enrollment, deletedCallback }: {
  enrollment: EnrollmentWithPerson
  deletedCallback: (enrollmentId: number) => void
}) {
  const [message, setMessage] = useState('')
  const [deletedClicked, setDeletedClicked] = useState(false)
  const [pending, startTransition] = useTransition()

  const deleteClick = () => {
    startTransition(async () => {
      try {
        const enrollmentId = enrollment.id

        const response = await fetch(`/api/enrollments/${enrollmentId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          return deletedCallback(enrollmentId)
        }

        const data = await response.json()

        if (data.message) {
          setMessage(data.message)
        } else {
          setMessage('Erro ao excluir matrícula. Tente novamente')
        }
      } catch {
        setMessage('Erro ao excluir matrícula. Tente novamente')
      }
    })
  }

  return (
    <>
      <TableRow hover>
        <TableCell>{enrollment.person.completeName}</TableCell>
        <TableCell
          align="right"
          sx={{
            position: 'sticky',
            right: 0,
            zIndex: 1,
            backgroundColor: 'background.paper',
          }}
        >
          {pending ? (
            <span>Excluindo...</span>
          ) : deletedClicked ? (
            <>
              <Button color="error" size="small" onClick={deleteClick}>
                Excluir
              </Button>
              <Button size="small" onClick={() => setDeletedClicked(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <Tooltip title="Excluir matrícula">
              <IconButton
                aria-label={`Excluir matrícula de ${enrollment.person.completeName}`}
                color="error"
                size="small"
                onClick={() => setDeletedClicked(true)}
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      {message && (
        <TableRow>
          <TableCell colSpan={2} sx={{ color: 'error.main' }}>
            {message}
          </TableCell>
        </TableRow>
      )}
    </>
  )
}