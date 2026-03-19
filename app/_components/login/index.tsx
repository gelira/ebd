'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

function FirstStep({ nextStep }: { nextStep: (authCodeId: number) => void }){
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    const params = new URLSearchParams({
      email: email.trim(),
    })

    try {
      const response = await fetch(`/api/login/auth-code?${params.toString()}`)

      if (!response.ok) {
        setErrorMessage('Algo deu errado. Tente novamente.')
        return
      }

      const data = await response.json() as { authCodeId: number }

      nextStep(data.authCodeId)
    } catch {
      setErrorMessage('Algo deu errado. Tente novamente.')
    }
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
      <button onClick={handleSubmit}>Próximo</button>
    </div>
  )
}

function SecondStep({ authCodeId }: { authCodeId: number}){
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/login/auth-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCodeId,
          code,
        }),
      })

      if (!response.ok) {
        throw new Error()
      }

      router.push('/')

    } catch {
      setErrorMessage('Algo deu errado. Tente novamente.')
    }
  }

  return (
    <div>
      <label>
        Insira o código enviado para seu email:
        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={
            (e) => {
              setCode(e.target.value)
              setErrorMessage('')
            }
          }
        />
      </label>
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  )
}

export function Login() {
  const [authCodeId, setAuthCodeId] = useState<number | null>(null)

  if (!authCodeId) {
    return <FirstStep nextStep={setAuthCodeId} />
  }

  return <SecondStep authCodeId={authCodeId} />
}
