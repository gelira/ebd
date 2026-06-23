'use client'

import { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import type { AttendanceTypeEnum } from '@/app/_lib/generated/prisma/client'
import { ChangeEvent } from 'react'

export default function Attendance({ enrollment, onChange }: {
  enrollment: EnrollmentWithPerson
  onChange: (personId: number, attendance: AttendanceTypeEnum) => void
}) {
  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(enrollment.personId, event.currentTarget.value as AttendanceTypeEnum)
  }

  return (
    <div>
      <label>
        {enrollment.person.completeName}
        <select
          onChange={onSelectChange}
          name={`attendance-${enrollment.personId}`}
          defaultValue=""
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