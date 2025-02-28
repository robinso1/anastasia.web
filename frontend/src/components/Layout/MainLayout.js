import React, { useState, useEffect } from 'react';
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
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Popover,
  Paper,
  ListItemButton,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Task as TaskIcon,
  Message as MessageIcon,
  Book as KnowledgeIcon,
  Timeline as WorkloadIcon,
  Description as ReportIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { socket } from '../../services/socket';
import { useSnackbar } from 'notistack';
import { debounce } from 'lodash';

const drawerWidth = 240;

const menuItems = [
  { text: 'Задачи', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Сообщения', icon: <MessageIcon />, path: '/messages' },
  { text: 'База знаний', icon: <KnowledgeIcon />, path: '/knowledge' },
  { text: 'График загрузки', icon: <WorkloadIcon />, path: '/workload' },
  { text: 'Отчеты', icon: <ReportIcon />, path: '/reports' },
];

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth.user);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Подключение к WebSocket для уведомлений
  useEffect(() => {
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Показываем всплывающее уведомление
      enqueueSnackbar(notification.message, {
        variant: notification.type || 'info',
        autoHideDuration: 3000,
      });
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  // Поиск по всем разделам
  const handleSearch = debounce(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await dispatch(searchAll(query));
      setSearchResults(results);
    } catch (error) {
      enqueueSnackbar('Ошибка при поиске', { variant: 'error' });
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleSearchItemClick = (item) => {
    setSearchDialogOpen(false);
    setSearchQuery('');
    navigate(item.path);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <TextField
            placeholder="Поиск по всем разделам..."
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            onClick={() => setSearchDialogOpen(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300, mr: 2 }}
          />
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton
            color="inherit"
            onClick={handleUserMenuClick}
            sx={{ ml: 2 }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>
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
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Планировщик
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem button onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Настройки" />
          </ListItem>
          <ListItem button onClick={() => navigate('/help')}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Помощь" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Меню уведомлений */}
      <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 400, maxHeight: 400, overflow: 'auto' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Уведомления</Typography>
            <Button size="small" onClick={handleMarkAllRead}>
              Прочитать все
            </Button>
          </Box>
          <Divider />
          <List>
            {notifications.map((notification, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                }}
              >
                <ListItemIcon>
                  {notification.type === 'success' && <CheckIcon color="success" />}
                  {notification.type === 'warning' && <WarningIcon color="warning" />}
                  {notification.type === 'error' && <ErrorIcon color="error" />}
                  {(!notification.type || notification.type === 'info') && <InfoIcon color="info" />}
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Нет уведомлений"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Popover>

      {/* Меню пользователя */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Профиль" />
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Настройки" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Выйти" />
        </MenuItem>
      </Menu>

      {/* Диалог поиска */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <TextField
            autoFocus
            fullWidth
            placeholder="Поиск по всем разделам..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: isSearching && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />
        </DialogTitle>
        <DialogContent>
          <List>
            {searchResults.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleSearchItemClick(item)}
              >
                <ListItemIcon>
                  {item.type === 'task' && <TaskIcon />}
                  {item.type === 'message' && <MessageIcon />}
                  {item.type === 'knowledge' && <KnowledgeIcon />}
                  {item.type === 'workload' && <WorkloadIcon />}
                  {item.type === 'report' && <ReportIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={`${item.type} • ${item.description}`}
                />
                <Chip
                  label={item.section}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </ListItemButton>
            ))}
            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <ListItem>
                <ListItemText
                  primary="Ничего не найдено"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;
