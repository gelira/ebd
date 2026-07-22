'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function PersonSelect({ termId, classroomId, persons }: {
  termId?: number
  classroomId: number
  persons: { id: number, completeName: string }[]
}) {
  const [personIdList, setPersonIdList] = useState<number[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [pending, startTransition] = useTransition()

  const router = useRouter()

  if (!termId) {
    return (
      <p className="text-error text-sm font-medium">Não há período atual</p>
    )
  }

  if (persons.length === 0) {
    return (
      <p className="text-error text-sm font-medium">Não há pessoas para matricular</p>
    )
  }

  const handleClick = () => {
    if (personIdList.length === 0) {
      setErrorMessage('Selecione pelo menos uma pessoa')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/enrollments', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            termId,
            classroomId,
            personIdList
          })
        })

        if (response.ok) {
          return router.push(`/classroom/${classroomId}`)
        }

        const data = await response.json()

        if (data.message) {
          setErrorMessage(data.message)
        } else {
          setPersonIdList([])
        }
      } catch {
        setErrorMessage('Erro ao matricular')
      }
    })
  }

  const handleSelectPerson = (id: number) => {
    if (id === 0) return
    if (!personIdList.includes(id)) {
      setPersonIdList((prev) => [...prev, id])
    }
    setErrorMessage('')
  }

  const handleRemovePerson = (id: number) => {
    setPersonIdList((prev) => prev.filter((pId) => pId !== id))
  }

  const selectedPersons = persons.filter((p) => personIdList.includes(p.id))

  return (
    <>
      <div className="form-control w-full">
        <select
          className="select select-bordered w-full"
          value={0}
          onChange={(e) => handleSelectPerson(Number(e.target.value))}
        >
          <option value={0} disabled>Selecione uma pessoa...</option>
          {persons
            .filter((p) => !personIdList.includes(p.id))
            .map((person) => (
              <option key={person.id} value={person.id}>{person.completeName}</option>
            ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedPersons.map((person) => (
          <button
            key={person.id}
            className="badge badge-primary badge-outline gap-2 hover:badge-error transition-colors h-auto py-1.5 px-3"
            onClick={() => handleRemovePerson(person.id)}
            title="Clique para remover"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            {person.completeName}
          </button>
        ))}
      </div>

      {errorMessage && <p className="text-error text-sm font-medium">{errorMessage}</p>}

      <div className="card-actions justify-end">
        <button
          className={`btn btn-primary ${pending ? 'loading' : ''}`}
          onClick={handleClick}
          disabled={pending || personIdList.length === 0}
        >
          {pending ? 'Matriculando...' : 'Matricular'}
        </button>
      </div>
    </>
  )
}