import { useRouter } from 'next/router'
import { useState } from 'react'

export default function SecondStep({ authCodeId }: { authCodeId: number}){
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