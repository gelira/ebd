'use client'

import { Button, Stack, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SecondStep({ authCodeId }: { authCodeId: number }) {
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [pending, startTransition] = useTransition()

  const router = useRouter()
  
  const handleSubmit = () => {
    if (!code) {
      setErrorMessage('Insira o código enviado para seu email')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ authCodeId, code })
        })

        if (!response.ok) {
          throw new Error()
        }

        router.push('/')

      } catch {
        setErrorMessage('Algo deu errado. Tente novamente.')
      }
    })
  }

    return (
    <Stack spacing={3}>
      <TextField
        label="Código"
        fullWidth
        value={code}
        error={!!errorMessage}
        helperText={errorMessage}
        onChange={
          (e) => {
            setErrorMessage('')
            setCode(e.target.value)
          }
        }
      />

      <Button
        color="success"
        variant="contained"
        size="large"
        onClick={handleSubmit}
        loading={pending}
      >
        Entrar
      </Button>
    </Stack>
  )
}