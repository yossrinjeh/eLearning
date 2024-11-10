import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PageHeader = ({ title, onAdd, showAddButton = true }) => {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" component="h1" fontWeight="bold">
        {title}
      </Typography>
      {showAddButton && (
        <Button
          variant="contained"
          onClick={onAdd}
          startIcon={<AddIcon />}
          sx={{
            px: 3,
            py: 1,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Add New
        </Button>
      )}
    </Box>
  );
};

export default PageHeader; 