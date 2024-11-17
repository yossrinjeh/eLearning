import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Avatar, CircularProgress } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { School, GroupAdd, Timeline, EmojiEvents } from '@mui/icons-material';
import api from '../services/api';
import endpoints from '../config/endpoints';

const AboutUs = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(endpoints.public.aboutStats);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Icon mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'student':
        return <School />;
      case 'trainer':
        return <GroupAdd />;
      case 'course':
        return <Timeline />;
      case 'trophy':
        return <EmojiEvents />;
      default:
        return <School />;
    }
  };

  const team = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://source.unsplash.com/random/400x400?face-1',
      bio: 'With over 15 years of experience in education technology.',
    },
    {
      name: 'Jane Smith',
      role: 'Head of Education',
      image: 'https://source.unsplash.com/random/400x400?face-2',
      bio: 'Former university professor with a passion for online learning.',
    },
    {
      name: 'Mike Johnson',
      role: 'Technical Director',
      image: 'https://source.unsplash.com/random/400x400?face-3',
      bio: 'Expert in educational software and learning platforms.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          pt: 15,
          pb: 6,
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            About Us
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Transforming Education Through Technology
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              At E-Learning Platform, we believe that quality education should be accessible to everyone. Our mission is to provide a comprehensive learning experience that empowers individuals to achieve their professional goals.
            </Typography>
            <Typography variant="body1">
              We collaborate with industry experts and leading professionals to deliver cutting-edge courses that prepare our students for real-world challenges.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Our Vision
            </Typography>
            <Typography variant="body1" paragraph>
              We envision a world where geographical and economic barriers no longer limit access to quality education. Our platform serves as a bridge connecting ambitious learners with expert educators.
            </Typography>
            <Typography variant="body1">
              Through innovative technology and pedagogical approaches, we're building the future of education.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {stats && Object.entries(stats).map(([key, stat], index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card sx={{ height: '100%', textAlign: 'center' }}>
                    <CardContent>
                      <Box sx={{ color: 'primary.main', mb: 2 }}>
                        {getIcon(stat.icon)}
                      </Box>
                      <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                        {stat.count}
                      </Typography>
                      <Typography color="text.secondary">
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" textAlign="center">
          Our Leadership Team
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {team.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={member.image}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default AboutUs; 