import type { Congregation } from '@/app/_lib/generated/prisma/client'
import type { RequiredUser } from '@/app/_lib/services/auth'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import PeopleIcon from '@mui/icons-material/People'
import AssessmentIcon from '@mui/icons-material/Assessment'
import Link from 'next/link'

export default function SideMenu({ congregations, user, onItemClick }: {
  congregations: Congregation[]
  user: RequiredUser
  onItemClick: () => void
}) {
  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary={user.name} />
      </ListItem>

      <Divider />

      {congregations.length > 0 && (
        <ListSubheader>Congregações</ListSubheader>
      )}

      {congregations.map((congregation) => (
        <ListItemButton
          key={congregation.id}
          onClick={onItemClick}
          sx={{ '& a': { color: 'inherit', textDecoration: 'none' } }}
        >
          <Link href={`/congregation/${congregation.id}`}>
            <ListItemText primary={congregation.name} />        
          </Link>
        </ListItemButton>
      ))}

      <Divider />

      <ListItemButton component={Link} href="/persons" onClick={onItemClick}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Pessoas" />
      </ListItemButton>

      <ListItemButton component={Link} href="/reports" onClick={onItemClick}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Relatórios" />
      </ListItemButton>
    </List>
  )
}