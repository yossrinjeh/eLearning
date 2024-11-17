import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useScrollTrigger,
  Slide,
  Avatar,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { logout } from '../features/auth/authSlice';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const pages = [
    { 
      title: isAuthenticated ? 'Dashboard' : 'Home',
      path: isAuthenticated ? '/dashboard' : '/',
    },
    { title: 'About Us', path: '/about' },
    { title: 'Formations', path: 'formations' },
    { title: 'Trainers', path: 'trainers' },
  ];

  const handleNavClick = (path) => {
    handleCloseNavMenu();
    
    if (path === 'formations' || path === 'trainers') {
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: path } });
      } else {
        const element = document.getElementById(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDashboardClick = () => {
    handleCloseUserMenu();
    const dashboardRoute = user?.role === 'admin' 
      ? '/dashboard' 
      : user?.role === 'trainer' 
        ? '/dashboard' 
        : '/';
    navigate(dashboardRoute);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleCloseUserMenu();
    navigate('/');
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{
          bgcolor: isHomePage 
            ? (isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent')
            : 'rgba(255, 255, 255, 0.95)',
          boxShadow: isHomePage ? (isScrolled ? 1 : 'none') : 1,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <SchoolIcon 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                mr: 1,
                color: isHomePage 
                  ? (isScrolled ? 'primary.main' : 'white')
                  : 'primary.main'
              }} 
            />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: isHomePage 
                  ? (isScrolled ? 'primary.main' : 'white')
                  : 'primary.main',
                textDecoration: 'none',
                letterSpacing: '.1rem',
              }}
            >
              E-LEARNING
            </Typography>

            {/* Mobile menu icon */}
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ 
                color: isHomePage 
                  ? (isScrolled ? 'primary.main' : 'white')
                  : 'primary.main' 
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page.title} 
                    onClick={() => handleNavClick(page.path)}
                  >
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <SchoolIcon 
              sx={{ 
                display: { xs: 'flex', md: 'none' }, 
                mr: 1, 
                color: isHomePage 
                  ? (isScrolled ? 'primary.main' : 'white')
                  : 'primary.main'
              }} 
            />
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: isHomePage 
                  ? (isScrolled ? 'primary.main' : 'white')
                  : 'primary.main',
                textDecoration: 'none',
                letterSpacing: '.1rem',
              }}
            >
              E-LEARNING
            </Typography>

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              {pages.map((page) => (
                <Button
                  key={page.title}
                  onClick={() => handleNavClick(page.path)}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: isHomePage 
                      ? (isScrolled ? 'text.primary' : 'white')
                      : 'text.primary',
                    display: 'block',
                    '&:hover': {
                      color: isHomePage 
                        ? (isScrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.8)')
                        : 'primary.main',
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Auth buttons */}
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 1 }}>
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: isHomePage 
                            ? (isScrolled ? 'primary.main' : 'white')
                            : 'primary.main',
                          color: isHomePage 
                            ? (isScrolled ? 'white' : 'primary.main')
                            : 'white',
                        }}
                      >
                        {user?.firstname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleDashboardClick}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="text"
                    sx={{
                      color: isHomePage 
                        ? (isScrolled ? 'text.primary' : 'white')
                        : 'text.primary',
                      '&:hover': {
                        color: isHomePage 
                          ? (isScrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.8)')
                          : 'primary.main',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: isHomePage 
                        ? (isScrolled ? 'primary.main' : 'white')
                        : 'primary.main',
                      color: isHomePage 
                        ? (isScrolled ? 'white' : 'primary.main')
                        : 'white',
                      '&:hover': {
                        bgcolor: isHomePage 
                          ? (isScrolled ? 'primary.dark' : 'rgba(255, 255, 255, 0.9)')
                          : 'primary.dark',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 