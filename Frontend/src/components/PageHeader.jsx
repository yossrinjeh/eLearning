import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PageHeader = ({ title, onAdd }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Typography variant="h4" component="h1" fontWeight="bold">
        {title}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          px: 3,
        }}
      >
        Add New {title.slice(0, -1)} {/* Removes 's' from the end */}
      </Button>
    </Box>
  );
};

export default PageHeader; 