import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Mail as MailIcon,
  Assignment as TaskIcon,
  Event as EventIcon,
  Folder as ProjectIcon,
  Archive as ArchiveIcon,
  AttachMoney as BudgetIcon,
  Contacts as ContactsIcon,
  VerifiedUser as SignatureIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const menuItems = [
  { text: 'Сообщения', icon: <MailIcon />, path: '/messages' },
  { text: 'Задачи', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Мероприятия', icon: <EventIcon />, path: '/events' },
  { text: 'Проекты', icon: <ProjectIcon />, path: '/projects' },
  { text: 'Архив документов', icon: <ArchiveIcon />, path: '/documents' },
  { text: 'Сметы', icon: <BudgetIcon />, path: '/budget' },
  { text: 'Контакты', icon: <ContactsIcon />, path: '/contacts' },
  { text: 'Электронная подпись', icon: <SignatureIcon />, path: '/signature' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          ml: `${open ? drawerWidth : 0}px`,
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ГИПРОМЕЗ - Планировщик
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>ИП</Avatar>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: (theme) => theme.spacing(2),
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            ГИПРОМЕЗ
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <Toolbar /> {/* Spacer for AppBar */}
        {children}
      </Main>
    </Box>
  );
};

export default Layout; 