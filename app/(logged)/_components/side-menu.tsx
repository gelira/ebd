import prisma from '@/app/_lib/db/prisma'
import { requireUser } from '@/app/_lib/services/auth'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Link from 'next/link'

export default async function SideMenu() {
  const user = await requireUser()

  const congregations = await prisma.congregation.findMany({
    where: {
      usersCongregation: {
        some: {
          userId: user.id,
        },
      },
    },
  })

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary={user.name} />
      </ListItem>

      <ListItemButton>
        <ListItemText primary="Usuários" />
      </ListItemButton>

      <ListItemButton>
        <ListItemText primary="Produtos" />
      </ListItemButton>

      <ListItemButton>
        <ListItemText primary="Configurações" />
      </ListItemButton>

      {congregations.map((congregation) => (
        <ListItemButton key={congregation.id}>
          <Link href={`/congregation/${congregation.id}`}>
            {congregation.name}
          </Link>
        </ListItemButton>
      ))}
    </List>
  )
}