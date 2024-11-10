import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  MeetingRoom as RoomIcon,
  School as FormationIcon,
  Assignment as EnrollmentIcon,
  Assessment as EvaluationIcon,
  AssignmentInd as StudentEvaluationIcon,
  Person as TrainerIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['admin', 'trainer', 'student'] },
    { text: 'Rooms', icon: <RoomIcon />, path: '/rooms', roles: ['admin'] },
    { text: 'Formations', icon: <FormationIcon />, path: '/formations', roles: ['admin', 'trainer', 'student'] },
    { text: 'Enrollments', icon: <EnrollmentIcon />, path: '/enrollments', roles: ['admin'] },
    { text: 'Evaluations', icon: <EvaluationIcon />, path: '/evaluations', roles: ['admin', 'trainer', 'student'] },
    { text: 'Student Evaluations', icon: <StudentEvaluationIcon />, path: '/student-evaluations', roles: ['admin', 'trainer'] },
    { text: 'Trainers', icon: <TrainerIcon />, path: '/trainers', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const drawer = (
    <div>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          E-Learning
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <List sx={{ px: 2 }}>
        {filteredMenuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => navigate(item.path)}
            component="div"
            sx={{
              mb: 1,
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: 500,
                  fontSize: '0.875rem',
                } 
              }} 
            />
          </ListItem>
        ))}
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.12)' }} />
        <ListItem
          onClick={handleLogout}
          component="div"
          sx={{
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              '& .MuiListItemText-primary': { 
                fontWeight: 500,
                fontSize: '0.875rem',
              } 
            }} 
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end', px: { xs: 3, lg: 6 } }}>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ color: 'text.primary' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#1e293b',
              color: 'white',
              borderRight: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4, md: 6 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#f8fafc',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 