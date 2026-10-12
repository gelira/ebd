import { dbCachedGetUserCongregations } from '@/app/_lib/db/congregation'
import { requireUser } from '@/app/_lib/services/auth'
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await requireUser()

  const congregations = await dbCachedGetUserCongregations(user.id)

  if (congregations.length === 1) {
    redirect(`/congregation/${congregations[0].id}`)
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Congregações
      </Typography>

      {congregations.length > 1 ? (
        <Stack spacing={2} sx={{ '& a': { textDecoration: 'none' } }}>
          {congregations.map((congregation) => (
            <Link key={congregation.id} href={`/congregation/${congregation.id}`} passHref>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography component="h2" variant="h6">
                      {congregation.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">
          Você não tem acesso a nenhuma congregação.
        </Typography>
      )}
    </Box>
  )
}
