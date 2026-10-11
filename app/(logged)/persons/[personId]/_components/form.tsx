'use client'

import type { Person } from '@/app/_lib/generated/prisma/client'
import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function PersonForm({ person }: { person: Person | null }) {
  const [completeName, setCompleteName] = useState(person?.completeName || '')
  const router = useRouter()
  
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

        const url = `/api/persons${person?.id ? `/${person.id}` : '' }`
        const method = person?.id ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ completeName, birthDate })
        })

        if (!response.ok) {
          throw new Error()
        }

        router.push('/persons')

      } catch {
        setErrorMessage('Algo deu errado. Tente novamente.')
      }
    })
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 600 }}>
      <Link href="/persons">
        <Button variant="text" sx={{ alignSelf: 'flex-start' }}>
          Voltar para a lista de pessoas
        </Button>
      </Link>

      <Typography component="h1" variant="h5">
        {person ? 'Editar pessoa' : 'Adicionar pessoa'}
      </Typography>

      <TextField
        label="Nome completo"
        value={completeName}
        onChange={(e) => {
          setErrorMessage('')
          setCompleteName(e.target.value)
        }}
        fullWidth
      />

      <TextField
        label="Data de nascimento"
        type="date"
        value={birthDate}
        onChange={(e) => {
          setErrorMessage('')
          setBirthDate(e.target.value)
        }}
        slotProps={{ inputLabel: { shrink: true } }}
        fullWidth
      />

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={pending}
        sx={{ alignSelf: 'flex-start' }}
      >
        {pending ? 'Salvando...' : 'Salvar'}
      </Button>
    </Stack>
  )
}