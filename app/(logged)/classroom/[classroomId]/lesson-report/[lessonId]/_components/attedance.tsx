'use client'

import { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import { ChangeEvent } from 'react'

export default function Attendance({ enrollment, onChange }: {
  enrollment: EnrollmentWithPerson
  onChange: (personId: number, attendance: string) => void
}) {
  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(enrollment.personId, event.currentTarget.value)
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
          <option value="present">Presente</option>
          <option value="absent">Ausente</option>
          <option value="justified_absent">Falta justificada</option>
        </select>
      </label>
    </div>
  )
}