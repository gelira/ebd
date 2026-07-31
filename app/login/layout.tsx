import { getCurrentUser } from '@/app/_lib/services/auth'
import { redirect } from 'next/navigation'

import { Box, Container } from '@mui/material'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (user) {
    return redirect('/')
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          minHeight: '100dvh',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </Box>
    </Container>
  )
}
