'use client'

import InputError from '@/app/_components/input-error'
import { actionValidateAuthCode } from '@/app/_lib/actions/auth'
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
        const { ok } = await actionValidateAuthCode({ authCodeId, code })

        if (!ok) {
          throw new Error()
        }

        router.push('/')

      } catch {
        setErrorMessage('Algo deu errado. Tente novamente.')
      }
    })
  }

  return (
    <>
      <div className="mt-8">
        <label className="floating-label">
          <span>Código</span>
          <input
            type="text"
            placeholder="Código"
            autoComplete="off"
            className={`input input-md ${errorMessage ? 'input-error' : ''}`}
            onChange={
              (e) => {
                setErrorMessage('')
                setCode(e.target.value)
              }
            }
            value={code}
          />
        </label>
        <InputError errorMessage={errorMessage} />
      </div>

      <div className="mt-4">
        <button
          className="btn btn-success btn-block"
          onClick={handleSubmit}
          disabled={pending}
        >
          Entrar
        </button>
      </div>
    </>
  )
}