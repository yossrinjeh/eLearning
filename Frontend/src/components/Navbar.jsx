import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

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

  const pages = [
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

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{
          bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          boxShadow: isScrolled ? 1 : 'none',
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
                color: isScrolled ? 'primary.main' : 'white'
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
                color: isScrolled ? 'primary.main' : 'white',
                textDecoration: 'none',
                letterSpacing: '.1rem',
              }}
            >
              E-LEARNING
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ color: isScrolled ? 'primary.main' : 'white' }}
              >
                <MenuIcon />
              </IconButton>
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
            <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: isScrolled ? 'primary.main' : 'white' }} />
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
                color: isScrolled ? 'primary.main' : 'white',
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
                    color: isScrolled ? 'text.primary' : 'white',
                    display: 'block',
                    '&:hover': {
                      color: isScrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Auth buttons */}
            <Box sx={{ flexGrow: 0, display: 'flex', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                sx={{
                  color: isScrolled ? 'text.primary' : 'white',
                  '&:hover': {
                    color: isScrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
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
                  bgcolor: isScrolled ? 'primary.main' : 'white',
                  color: isScrolled ? 'white' : 'primary.main',
                  '&:hover': {
                    bgcolor: isScrolled ? 'primary.dark' : 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 