'use client'

import { createEnrollments } from '@/app/_lib/actions/enrollment'
import { useState, useTransition } from 'react'

export default function PersonSelect({ termId, classroomId, enrollmentType, persons }: {
  termId: number,
  classroomId: number,
  enrollmentType: 'TEACHER' | 'STUDENT',
  persons: { id: number, completeName: string }[],
}) {
  const [personIdList, setPersonIdList] = useState<number[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [pending, startTransition] = useTransition()

  const handleClick = () => {
    if (personIdList.length === 0) {
      setErrorMessage('Selecione pelo menos uma pessoa')
      return
    }

    startTransition(async () => {
      try {
        const result = await createEnrollments({
          termId,
          classroomId,
          enrollmentType,
          personIdList,
        })

        if (result?.message) {
          setErrorMessage(result.message)
        }
      } catch {
        setErrorMessage('Erro ao matricular')
      }
    })
  }

  return (
    <div>
      <label>
        Pessoa:
        <select
          multiple
          onChange={
            (e) => {
              setErrorMessage('')

              const selectedValues = Array.from(e.target.options).reduce((acc, curr) => {
                if (curr.selected) {
                  acc.push(Number(curr.value))
                }

                return acc
              }, [] as number[])

              setPersonIdList(selectedValues)
            }
          }
        >
          {persons.map((person) => (
            <option key={person.id} value={person.id}>{person.completeName}</option>
          ))}
        </select>
      </label>
      <button onClick={handleClick} disabled={pending}>
        Matricular
      </button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  )
}