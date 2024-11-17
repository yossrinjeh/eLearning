import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TermsOfService = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 12 }}>
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">Terms of Service</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Terms of Service
        </Typography>

        <Typography variant="body1" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          2. User Account
        </Typography>
        <Typography variant="body1" paragraph>
          To access certain features of the platform, you must register for an account. You agree to provide accurate information and maintain the security of your account.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          3. Course Content
        </Typography>
        <Typography variant="body1" paragraph>
          All content provided on this platform is for educational purposes only. You agree not to reproduce, distribute, or create derivative works without our express permission.
        </Typography>

        {/* Add more sections as needed */}
      </Container>

      <Footer />
    </Box>
  );
};

export default TermsOfService; 