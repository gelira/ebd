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
    <>
      <div>
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
          Email:
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={
              (e) => {
                setEmail(e.target.value)
                setErrorMessage('')
              }
            }
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Enviar código
        </button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </>
  )
}