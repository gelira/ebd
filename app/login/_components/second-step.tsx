'use client'

import { validateAuthCode } from '@/app/_lib/actions/auth'
import { useState, useTransition } from 'react'

export default function SecondStep({ authCodeId }: { authCodeId: number }) {
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [pending, startTransition] = useTransition()
  
  const handleSubmit = () => {
    if (!code) {
      setErrorMessage('Insira o código enviado para seu email')
      return
    }

    startTransition(async () => {
      try {
        const { ok } = await validateAuthCode({ authCodeId, code })

        if (!ok) {
          throw new Error()
        }
      } catch {
        setErrorMessage('Algo deu errado. Tente novamente.')
      }
    })
  }

  return (
    <div>
      <label>
        Insira o código enviado para seu email:
        <input
          type="text"
          placeholder="Código"
          name="code"
          onChange={
            (e) => {
              setCode(e.target.value)
              setErrorMessage('')
            }
          }
        />
      </label>
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={handleSubmit} disabled={pending}>Entrar</button>
    </div>
  )
}