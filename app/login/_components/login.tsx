'use client'

import { useState } from 'react'

import FirstStep from './first-step'
import SecondStep from './second-step'

export default function Login() {
  const [authCodeId, setAuthCodeId] = useState<number | null>(null)

  if (!authCodeId) {
    return <FirstStep nextStep={setAuthCodeId} />
  }

  return <SecondStep authCodeId={authCodeId} />
}