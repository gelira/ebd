'use client'

import InputError from '@/app/_components/input-error'
import { useState, useTransition } from 'react'

export default function FirstStep({ nextStep }: { nextStep: (authCodeId: number) => void }) {
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
    <>
      <div className="mt-8">
        <label className="floating-label">
          <span>Email</span>
          <input
            type="text"
            placeholder="Email"
            className={`input input-md ${errorMessage ? 'input-error' : ''}`}
            onChange={
              (e) => {
                setErrorMessage('')
                setEmail(e.target.value)
              }
            }
            value={email}
          />
        </label>
        <InputError errorMessage={errorMessage} />
      </div>

      <div className="mt-4">
        <button
          className="btn btn-primary btn-block"
          onClick={handleSubmit}
          disabled={pending}
        >
          Enviar código
        </button>
      </div>
    </>
  )
}