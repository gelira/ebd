'use client'

import { useState } from 'react'
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import type { RequiredUser } from '@/app/_lib/services/auth'

const drawerWidth = 260

export default function BaseLayout({ children, menuElement, user }: {
  children: React.ReactNode
  menuElement: React.ReactNode
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
        {menuElement}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          pt: 0
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}