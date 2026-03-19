'use client'

import { useState } from 'react'

export default function FirstStep({ nextStep }: { nextStep: (authCodeId: number) => void }){
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