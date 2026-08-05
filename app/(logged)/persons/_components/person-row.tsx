'use client'

import Link from 'next/link'
import { Edit } from '@mui/icons-material'
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import type { Person } from '@/app/_lib/generated/prisma/client'

export default function PersonRow({ person }: { person: Person }) {
  const birthDate = (() => {
    if (!person.birthDate) {
      return 'Não definido'
    }

    const [year, month, day] = new Date(person.birthDate).toISOString().split('T')[0].split('-')

    return `${day}/${month}/${year}`
  })()

  return (
    <TableRow hover>
      <TableCell>{person.completeName}</TableCell>

      <TableCell align="center">{birthDate}</TableCell>

      <TableCell align="right">
        <Link href={`/persons/${person.id}`}>
          <Tooltip title="Editar">
            <IconButton size="small" color="primary">
              <Edit />
            </IconButton>
          </Tooltip>
        </Link>
      </TableCell>
    </TableRow>
  )
}