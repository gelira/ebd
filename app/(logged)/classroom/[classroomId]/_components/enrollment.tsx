'use client'

import type { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'

export default function Enrollment({ enrollment, deletedCallback }: {
  enrollment: EnrollmentWithPerson
  deletedCallback: (enrollment: EnrollmentWithPerson) => void
}) {
  return (
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
        <Tooltip title="Excluir matrícula">
          <IconButton
            aria-label={`Excluir matrícula de ${enrollment.person.completeName}`}
            color="error"
            size="small"
            onClick={() => deletedCallback(enrollment)}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}