'use client'

import { Button, Stack, TextField } from '@mui/material'
import { useState, useTransition } from 'react'

export default function FirstStep({ nextStep }: {
  nextStep: (authCodeId: number) => void
}) {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [pending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!email) {
      setErrorMessage('Insira seu email')
      return
    }

    startTransition(async () => {
      try {
        const params = new URLSearchParams({ email })
        const response = await fetch(`/api/login?${params}`)

        if (!response.ok) {
          throw new Error()
        }

        const { authCodeId }: { authCodeId: number } = await response.json()

        nextStep(authCodeId)

      } catch {
        setErrorMessage('Algo deu errado. Tente novamente.')
      }
    })
  }

  return (
    <Stack spacing={3}>
      <TextField
        label="E-mail"
        type="email"
        fullWidth
        value={email}
        error={!!errorMessage}
        helperText={errorMessage}
        onChange={
          (e) => {
            setErrorMessage('')
            setEmail(e.target.value)
          }
        }
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        onClick={handleSubmit}
        loading={pending}
      >
        Enviar código
      </Button>
    </Stack>
  )
}