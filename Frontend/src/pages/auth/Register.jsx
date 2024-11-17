import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0); // 0 for student, 1 for trainer
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    role: 'student',
    // Trainer specific fields
    specialities: '',
    experience: '',
    cv_file: null,
  });
  const [fileName, setFileName] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFormData({
      ...formData,
      role: newValue === 0 ? 'student' : 'trainer',
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'cv_file') {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          cv_file: file,
        });
        setFileName(file.name);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate CV file for trainer role
    if (formData.role === 'trainer' && !formData.cv_file) {
      alert('Please upload your CV file');
      return;
    }

    // Create FormData object
    const submitData = new FormData();

    // Append basic user data
    submitData.append('firstname', formData.firstname);
    submitData.append('lastname', formData.lastname);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('password_confirmation', formData.password_confirmation);
    submitData.append('phone', formData.phone);
    submitData.append('address', formData.address);
    submitData.append('role', formData.role);

    // If trainer role, append trainer specific fields directly
    if (formData.role === 'trainer') {
      submitData.append('specialities', formData.specialities);
      submitData.append('experience', formData.experience);
      submitData.append('cv_file', formData.cv_file);
    }

    const result = await dispatch(register(submitData));
    if (!result.error) {
      navigate('/');
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
            }}
          >
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Sign Up
            </Typography>

            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', width: '100%' }}
            >
              <Tab 
                label="Student" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'medium',
                  flex: 1
                }} 
              />
              <Tab 
                label="Trainer" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'medium',
                  flex: 1
                }} 
              />
            </Tabs>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error.message}</Alert>}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="firstname"
                    label="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="lastname"
                    label="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="address"
                    label="Address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Trainer specific fields */}
                {activeTab === 1 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="specialities"
                        label="Specialities"
                        value={formData.specialities}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        helperText="Enter your specialities separated by commas"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="experience"
                        label="Experience"
                        value={formData.experience}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        helperText="Describe your professional experience"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        sx={{
                          width: '100%',
                          py: 1.5,
                          borderRadius: 2,
                          borderStyle: 'dashed',
                        }}
                      >
                        Upload CV
                        <input
                          type="file"
                          name="cv_file"
                          onChange={handleChange}
                          accept=".pdf,.doc,.docx"
                          style={{ display: 'none' }}
                        />
                      </Button>
                      {fileName && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Selected file: {fileName}
                        </Typography>
                      )}
                    </Grid>
                  </>
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  height: 48,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link 
                  to="/login" 
                  style={{ 
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  Already have an account? Sign In
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

export default Register;