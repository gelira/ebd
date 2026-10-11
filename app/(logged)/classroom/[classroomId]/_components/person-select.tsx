'use client'

import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
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

  const handleRemovePerson = (id: number) => {
    setPersonIdList((prev) => prev.filter((pId) => pId !== id))
  }

  const selectedPersons = persons.filter((person) => personIdList.includes(person.id))

  return (
    <>
      <Autocomplete
        multiple
        options={persons}
        value={selectedPersons}
        filterSelectedOptions
        getOptionLabel={(person) => person.completeName}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, selected) => {
          setPersonIdList(selected.map((person) => person.id))
          setErrorMessage('')
        }}
        renderValue={(selected, getItemProps) =>
          selected.map((person, index) => {
            const { key, ...itemProps } = getItemProps({ index })

            return (
              <Chip
                key={key}
                label={person.completeName}
                title="Clique para remover"
                {...itemProps}
                onClick={() => handleRemovePerson(person.id)}
              />
            )
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Alunos"
            placeholder="Digite para buscar alunos"
          />
        )}
      />

      {errorMessage && <p className="text-error text-sm font-medium">{errorMessage}</p>}

      <div className="card-actions justify-end mt-3">
        <Button
          variant="contained"
          color="success"
          onClick={handleClick}
          disabled={pending || personIdList.length === 0}
        >
          {pending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </>
  )
}