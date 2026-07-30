'use client'

import { useState } from 'react'

import { Card, CardContent, Typography } from '@mui/material'

import FirstStep from './first-step'
import SecondStep from './second-step'

export default function Login() {
  const [authCodeId, setAuthCodeId] = useState<number | null>(null)

  return (
    <Card sx={{ width: "100%", maxWidth: 420 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Sistema EBD
        </Typography>

        {!authCodeId ? (
          <FirstStep nextStep={setAuthCodeId} />
        ) : (
          <SecondStep authCodeId={authCodeId} />
        )}
      </CardContent>
    </Card>
  )
}