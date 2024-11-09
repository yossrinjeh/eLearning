import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PageHeader = ({ title, onAdd, showAddButton = true }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        py: 2,
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{
          fontWeight: 700,
          color: '#1e293b',
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        {title}
      </Typography>
      {showAddButton && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1,
            bgcolor: '#0f172a',
            '&:hover': {
              bgcolor: '#1e293b',
            },
            boxShadow: 'none',
          }}
        >
          Add New {title.slice(0, -1)}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader; 