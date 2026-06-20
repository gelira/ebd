'use client'

import { actionDeleteEnrollment } from '@/app/_lib/actions/enrollment'
import { EnrollmentWithPerson } from '@/app/_lib/db/enrollment'
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

        const { ok, message } = await actionDeleteEnrollment({ enrollmentId })

        if (!ok) {
          if (message) {
            setMessage(message)
          }

          return
        }

        deletedCallback(enrollmentId)

      } catch {
        setMessage('Erro ao excluir matrícula. Tente novamente')
      }
    })
  }

  return (
    <div>
      <span>{enrollment.person.completeName}</span>
      {pending ? (
        <p>Excluindo...</p>
      ) : (
        <>
          {deletedClicked ? (
            <div>
              <span>Deseja mesmo excluir essa matrícula?</span>
              <button onClick={deleteClick}>Sim</button>
              <button onClick={() => setDeletedClicked(false)}>Não</button>
            </div>
          ) : (
            <button onClick={() => setDeletedClicked(true)}>Deletar</button>
          )}
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}