'use client'

import type { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import { useCallback, useState } from 'react'
import {
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

  const removeEnrollment = useCallback((enrollmentId: number) => {
    setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId))
  }, [])

  return (
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
                deletedCallback={removeEnrollment}
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
  )
}