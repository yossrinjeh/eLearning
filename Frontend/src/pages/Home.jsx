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
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to E-Learning Platform
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            Discover our upcoming formations and start learning with expert trainers
          </Typography>
          <Box sx={{ maxWidth: 600 }}>
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
                  '& input': { color: 'white' },
                  '& input::placeholder': { color: 'rgba(255, 255, 255, 0.7)' },
                },
              }}
            />
          </Box>
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
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
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

            <Divider sx={{ my: 6 }} />

            {/* Active Trainers Section */}
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
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
          </>
        )}

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h5" component="p" gutterBottom>
            Ready to start learning?
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Register Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 