import prisma from '@/app/_lib/db/prisma'
import { requireUser } from '@/app/_lib/services/auth'
import { Button, Stack, Typography } from '@mui/material'
import Link from 'next/link'

import PersonsTable from './_components/persons-table'

export default async function Page() {
  const user = await requireUser()

  const persons = await prisma.person.findMany({
    where: { churchId: user.churchId },
    orderBy: { completeName: 'asc' },
  })

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Typography variant="h5">Lista de pessoas</Typography>
        <Link href="/persons/new">
          <Button variant="contained" color="primary">Adicionar</Button>
        </Link>
      </Stack>
      <PersonsTable persons={persons} />
    </>
  )
}