'use client'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import type { Person } from '@/app/_lib/generated/prisma/client'
import PersonRow from './person-row'

export default function PersonsTable({ persons }: {
  persons: Person[]
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>
              Nome
            </TableCell>

            <TableCell align="center" sx={{ fontWeight: 600 }}>
              Data de nascimento
            </TableCell>

            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {persons.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}