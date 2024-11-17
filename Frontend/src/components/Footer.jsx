import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              E-Learning Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Empowering learners worldwide with quality education and professional development opportunities.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Home
            </Link>
            <Link component={RouterLink} to="/about" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              About Us
            </Link>
            <Link component={RouterLink} to="/#formations" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Formations
            </Link>
            <Link component={RouterLink} to="/#trainers" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Trainers
            </Link>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom fontWeight="bold">
              Legal
            </Typography>
            <Link component={RouterLink} to="/privacy" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Privacy Policy
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Terms of Service
            </Link>
            <Link component={RouterLink} to="/cookie-policy" color="text.secondary" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
              Cookie Policy
            </Link>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email: contact@elearning.com
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Phone: +1 234 567 890
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: 123 Learning Street
              <br />
              Education City, ED 12345
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} E-Learning Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 