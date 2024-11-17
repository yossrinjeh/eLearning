import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 12 }}>
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">Privacy Policy</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Privacy Policy
        </Typography>

        <Typography variant="body1" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          1. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information you provide directly to us, including name, email address, and other contact details when you register for an account or communicate with us.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use the information we collect to:
        </Typography>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process your transactions and send related information</li>
          <li>Send technical notices, updates, and support messages</li>
          <li>Respond to your comments and questions</li>
        </ul>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          3. Information Sharing
        </Typography>
        <Typography variant="body1" paragraph>
          We do not share your personal information with third parties except as described in this policy or with your consent.
        </Typography>

        {/* Add more sections as needed */}
      </Container>

      <Footer />
    </Box>
  );
};

export default PrivacyPolicy; 