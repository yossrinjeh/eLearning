import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      const role = result.payload.user.role;
      
      switch (role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'trainer':
          navigate('/dashboard');
          break;
        case 'student':
          navigate('/');
          break;
        default:
          navigate('/');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 8 }}>
        <Container 
          component="main" 
          maxWidth="xs"
          sx={{ 
            width: '100%',
            pt: 8,
            pb: 4
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4,
              width: '100%',
              mx: 'auto'
            }}
          >
            <Typography component="h1" variant="h5" align="center">
              Sign In
            </Typography>
            {error && <Alert severity="error">{error.message}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login; 