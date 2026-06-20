'use client'

import { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
import { useCallback, useState } from 'react'
import Enrollment from './enrollment'

export default function Enrollments(props: {
  enrollments: EnrollmentWithPerson[]
}) {
  const [enrollments, setEnrollments] = useState(props.enrollments)

  const removeEnrollment = useCallback((enrollmentId: number) => {
    setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId))
  }, [])

  return (
    <div>
      {enrollments.map((enrollment) => (
        <Enrollment
          key={enrollment.id}
          enrollment={enrollment}
          deletedCallback={removeEnrollment}
        />
      ))}
    </div>
  )
}