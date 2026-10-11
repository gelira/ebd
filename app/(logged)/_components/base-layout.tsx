'use client'

import { useState } from 'react'
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import type { Congregation } from '@/app/_lib/generated/prisma/client'
import type { RequiredUser } from '@/app/_lib/services/auth'
import SideMenu from './side-menu'

const drawerWidth = 260

export default function BaseLayout({ children, congregations, user }: {
  children: React.ReactNode
  congregations: Congregation[]
  user: RequiredUser
}) {
  const [open, setOpen] = useState(false)

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100dvh',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
            sx={{
              mr: 2,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
            }}
          >
            {user.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <SideMenu
          congregations={congregations}
          user={user}
          onItemClick={() => setOpen(false)}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: '100%',
          boxSizing: 'border-box',
          p: { xs: 2, sm: 4 },
          pt: 0
        }}
      >
        <Toolbar sx={{ mb: 2 }} />
        {children}
      </Box>
    </Box>
  )
}