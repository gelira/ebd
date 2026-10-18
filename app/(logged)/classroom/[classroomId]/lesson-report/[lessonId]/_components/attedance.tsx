'use client'

import { AttendanceTypeEnum } from '@/app/_lib/generated/prisma/client'
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'

const COLORS: Record<AttendanceTypeEnum, 'success' | 'warning'> = {
  'PRESENT': 'success',
  'ABSENT': 'warning',
  'JUSTIFIED_ABSENT': 'warning',
}

export default function Attendance({
  personId,
  completeName,
  attendance,
  onChange,
}: {
  personId: number
  completeName: string
  attendance?: AttendanceTypeEnum
  onChange: (personId: number, attendance: AttendanceTypeEnum) => void
}) {
  const attendanceColor = attendance && COLORS[attendance] || 'primary'

  const onSelectChange = (event: SelectChangeEvent<string>) => {
    onChange(personId, event.target.value as AttendanceTypeEnum)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        gap: 2,
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Typography
        component="label"
        htmlFor={`attendance-select-${personId}`}
        sx={{ fontWeight: 500, flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}
      >
        {completeName}
      </Typography>
      <FormControl size="small" required sx={{ minWidth: 180 }}>
        <Select
          id={`attendance-select-${personId}`}
          inputProps={{ id: `attendance-select-${personId}` }}
          name={`attendance-${personId}`}
          value={attendance ?? ''}
          displayEmpty
          onChange={onSelectChange}
          required
          color={attendanceColor}
          sx={{
            color: `${attendanceColor}.main`,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: `${attendanceColor}.main`,
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>Selecione</em>
          </MenuItem>
          <MenuItem value="PRESENT">Presente</MenuItem>
          <MenuItem value="ABSENT">Ausente</MenuItem>
          <MenuItem value="JUSTIFIED_ABSENT">
            Falta justificada
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
