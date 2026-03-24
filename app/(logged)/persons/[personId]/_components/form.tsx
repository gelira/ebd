'use client'

import { createPerson, updatePerson } from '@/app/_lib/actions/person'
import type { Person } from '@/app/_lib/generated/prisma/client'
import { useState, useTransition } from 'react'

export default function PersonForm({ person }: { person: Person | null }) {
  const [completeName, setCompleteName] = useState(person?.completeName || '')
  
  const [birthDate, setBirthDate] = useState(() => {
    const currBirthDate = person?.birthDate

    if (!currBirthDate) {
      return ''
    }

    return new Date(currBirthDate).toISOString().split('T')[0]
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [pending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        if (completeName.length < 2) {
          setErrorMessage('Insira um nome completo')
          return
        }

        person?.id
          ? await updatePerson({ id: person.id, completeName, birthDate })
          : await createPerson({ completeName, birthDate })
      } catch {
        setErrorMessage('Algo deu errado. Tente novamente.')
      }
    })
  }

  return (
    <div>
      <div>
        <label>
          Nome completo:
          <input
            type="text"
            value={completeName}
            onChange={
              (e) => {
                setErrorMessage('')
                setCompleteName(e.target.value)
              }
            }
          />
        </label>
      </div>
      <div>
        <label>
          Data de nascimento:
          <input
            type="date"
            value={birthDate}
            onChange={
              (e) => {
                setErrorMessage('')
                setBirthDate(e.target.value)
              }
            }
          />
        </label>
      </div>
      <button onClick={handleSubmit} disabled={pending}>Salvar</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  )
}