'use client'

import type { AttendanceTypeEnum } from '@/app/_lib/generated/prisma/client'
import { ChangeEvent } from 'react'

export default function Attendance({
  personId,
  completeName,
  attendance,
  onChange
}: {
  personId: number
  completeName: string
  attendance?: AttendanceTypeEnum
  onChange: (personId: number, attendance: AttendanceTypeEnum) => void
}) {
  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(personId, event.currentTarget.value as AttendanceTypeEnum)
  }

  return (
    <div>
      <label>
        {completeName}
        <select
          onChange={onSelectChange}
          name={`attendance-${personId}`}
          defaultValue={attendance ?? ''}
          required
        >
          <option value="" disabled>Selecione</option>
          <option value="PRESENT">Presente</option>
          <option value="ABSENT">Ausente</option>
          <option value="JUSTIFIED_ABSENT">Falta justificada</option>
        </select>
      </label>
    </div>
  )
}