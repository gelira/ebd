'use client'

import { generateAuthCode } from '@/app/_lib/actions/auth'
import { useState, useTransition } from 'react'

export default function FirstStep({ nextStep }: { nextStep: (authCodeId: number) => void }) {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [pending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!email) {
      setErrorMessage('Insira um email')
      return
    }

    startTransition(async () => {
      try {
        const { ok, authCodeId } = await generateAuthCode({ email })

        if (!ok || !authCodeId) {
          throw new Error()
        }

        nextStep(authCodeId)
      } catch {
        setErrorMessage('Algo deu errado. Tente novamente.')
      }
    })
  }

  return (
    <div>
      <label>
        Insira seu email:
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={
            (e) => {
              setEmail(e.target.value)
              setErrorMessage('')
            }
          }
        />
      </label>
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={handleSubmit} disabled={pending}>Próximo</button>
    </div>
  )
}