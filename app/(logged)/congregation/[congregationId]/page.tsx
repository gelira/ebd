import { dbGetClassroomsByCongregationId } from '@/app/_lib/db/classroom'
import { requireUser } from '@/app/_lib/services/auth'
import { requireCongregation } from '@/app/_lib/services/congregation'
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import Link from 'next/link'

export default async function Page({ params }: {
  params: Promise<{ congregationId: string }>
}) {
  const { congregationId } = await params

  const user = await requireUser()
  const congregation = await requireCongregation({
    congregationId,
    userId: user.id,
  })

  const classrooms = await dbGetClassroomsByCongregationId({
    congregationId: congregation.id,
  })

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
        Classes - {congregation.name}
      </Typography>

      {classrooms.length > 0 ? (
        <Stack spacing={2} sx={{ '& a': { textDecoration: 'none' } }}>
          {classrooms.map((classroom) => (
            <Link key={classroom.id} href={`/classroom/${classroom.id}`} passHref>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography component="h2" variant="h6">
                      {classroom.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">
          Esta congregação não tem classes.
        </Typography>
      )}
    </Box>
  )
}