import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Room as RoomIcon,
} from '@mui/icons-material';
import api from '../services/api';
import endpoints from '../config/endpoints';
import Navbar from '../components/Navbar';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Home = () => {
  const [formations, setFormations] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formationsRes, trainersRes] = await Promise.all([
          api.get(endpoints.public.formations),
          api.get(endpoints.public.trainers),
        ]);
        setFormations(formationsRes.data);
        setTrainers(trainersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${endpoints.public.searchFormations}?query=${searchTerm}`);
      setFormations(response.data);
    } catch (error) {
      console.error('Error searching formations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'primary.main',
          color: 'white',
          pt: { xs: 15, md: 20 },
          pb: { xs: 10, md: 15 },
          mb: 6,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            opacity: 0.9,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #e2e8f0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 3,
                }}
              >
                Elevate Your Skills with Expert-Led Training
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Discover our comprehensive range of professional formations and start your journey towards excellence today.
              </Typography>
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  placeholder="Search formations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      '& input': { 
                        color: 'white',
                        fontSize: '1.1rem',
                        py: 1.5,
                      },
                      '& input::placeholder': { 
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Upcoming Formations Section */}
            <Box id="formations" sx={{ scrollMarginTop: 8 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                sx={{
                  fontWeight: 800,
                  textAlign: 'center',
                  mb: 6,
                  background: 'linear-gradient(45deg, #1e40af 30%, #3b82f6 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Upcoming Formations
              </Typography>
              <Grid container spacing={3} sx={{ mb: 6 }}>
                {formations.map((formation) => (
                  <Grid item xs={12} md={6} key={formation.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                          {formation.title}
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                          {formation.description}
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarIcon color="primary" />
                              <Typography variant="body2">
                                {formatDate(formation.start_date)} - {formatDate(formation.end_date)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon color="primary" />
                              <Typography variant="body2">
                                {formation.trainer.name}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <RoomIcon color="primary" />
                              <Typography variant="body2">
                                {formation.room.name}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={`${formation.seats_left} seats left`}
                            color={formation.seats_left > 0 ? 'success' : 'error'}
                            size="small"
                          />
                          <Chip
                            label={`${formation.duration} days`}
                            color="primary"
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ my: 8 }} />

            {/* Active Trainers Section */}
            <Box id="trainers" sx={{ scrollMarginTop: 8 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                sx={{
                  fontWeight: 800,
                  textAlign: 'center',
                  mb: 6,
                  background: 'linear-gradient(45deg, #1e40af 30%, #3b82f6 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Our Expert Trainers
              </Typography>
              <Grid container spacing={3}>
                {trainers.map((trainer) => (
                  <Grid item xs={12} sm={6} md={4} key={trainer.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 64,
                              height: 64,
                              bgcolor: 'primary.main',
                              mr: 2,
                            }}
                          >
                            {trainer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="h3" fontWeight="bold">
                              {trainer.name}
                            </Typography>
                            <Typography color="text.secondary">
                              {trainer.experience} of experience
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" paragraph>
                          <strong>Specialities:</strong> {trainer.specialities}
                        </Typography>
                        <Chip
                          label={`${trainer.formations_count} formations`}
                          color="primary"
                          size="small"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}

        {/* Call to Action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            my: 8,
            py: 8,
            px: 3,
            bgcolor: 'primary.main',
            borderRadius: 4,
            color: 'white',
            backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          }}
        >
          <Typography variant="h4" component="p" gutterBottom fontWeight="bold">
            Ready to Start Your Learning Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join our community of learners and advance your career
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 