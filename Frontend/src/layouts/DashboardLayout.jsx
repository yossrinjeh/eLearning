import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  MeetingRoom as RoomIcon,
  School as FormationIcon,
  Assignment as EnrollmentIcon,
  AssignmentTurnedIn as EvaluationIcon,
  Grade as StudentEvaluationIcon,
  Group as TrainerIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { logout } from '../features/auth/authSlice';

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'trainer', 'student'] },
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
    <Box>
      {/* Logo Section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon sx={{ color: 'white' }} />
        <Typography variant="h6" color="white" noWrap>
          E-LEARNING
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
      
      {/* Menu Items */}
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              px: 2.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: 240, flexShrink: 0 }}
      >
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              bgcolor: 'primary.dark',
              color: 'white',
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
          p: 3,
          width: `calc(100% - 240px)`,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 