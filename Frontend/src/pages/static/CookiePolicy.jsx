import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CookiePolicy = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 12 }}>
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">Cookie Policy</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Cookie Policy
        </Typography>

        <Typography variant="body1" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          1. What Are Cookies
        </Typography>
        <Typography variant="body1" paragraph>
          Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us make your experience better.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          2. How We Use Cookies
        </Typography>
        <Typography variant="body1" paragraph>
          We use cookies to:
        </Typography>
        <ul>
          <li>Remember your preferences and settings</li>
          <li>Understand how you use our website</li>
          <li>Keep you signed in</li>
          <li>Improve our services</li>
        </ul>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          3. Types of Cookies We Use
        </Typography>
        <Typography variant="body1" paragraph>
          Essential cookies: Required for the website to function properly
          Analytics cookies: Help us understand how visitors interact with our website
          Preference cookies: Remember your settings and preferences
        </Typography>

        {/* Add more sections as needed */}
      </Container>

      <Footer />
    </Box>
  );
};

export default CookiePolicy; 