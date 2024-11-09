import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  PersonAdd as EnrollIcon,
  CheckCircle as DoneIcon,
} from '@mui/icons-material';
import { fetchFormations } from '../../features/formations/formationsSlice';
import { createEnrollment } from '../../features/enrollments/enrollmentsSlice';
import { fetchEnrollments } from '../../features/enrollments/enrollmentsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const StudentFormationsList = () => {
  const dispatch = useDispatch();
  const { items: formations, loading } = useSelector((state) => state.formations);
  const { items: enrollments } = useSelector((state) => state.enrollments);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchFormations());
    dispatch(fetchEnrollments());
  }, [dispatch]);

  const handleEnrollClick = (formation) => {
    setSelectedFormation(formation);
    setOpenDialog(true);
  };

  const handleConfirmEnroll = async () => {
    if (selectedFormation && user) {
      const enrollmentData = {
        formation_id: selectedFormation.id,
        user_id: user.id,
        status: 'pending',
        enrollment_date: new Date().toISOString().split('T')[0],
      };

      await dispatch(createEnrollment(enrollmentData));
      dispatch(fetchEnrollments()); // Refresh enrollments after creating new one
      setOpenDialog(false);
      setSelectedFormation(null);
    }
  };

  // Calculate seats left and check if user is enrolled
  const getFormationDetails = (formation) => {
    const formationEnrollments = enrollments?.filter(e => e.formation_id === formation.id);
    const seatsLeft = formation.max_capacity - (formationEnrollments?.length || 0);
    const userEnrollment = formationEnrollments?.find(e => e.user_id === user.id);
    
    return {
      seatsLeft,
      userEnrollment,
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Available Formations
        </Typography>

        <TextField
          fullWidth
          placeholder="Search formations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {formations?.map((formation) => {
              const { seatsLeft, userEnrollment } = getFormationDetails(formation);
              return (
                <Grid item xs={12} sm={6} md={4} key={formation.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {formation.title}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        {formation.description}
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={formation.status} 
                          color={formation.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                        {userEnrollment && (
                          <Chip 
                            label={`Enrollment: ${userEnrollment.status}`}
                            color={getStatusColor(userEnrollment.status)}
                            size="small"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Start Date:</strong> {formatDate(formation.start_date)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>End Date:</strong> {formatDate(formation.end_date)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Duration:</strong> {formation.duration} days
                      </Typography>
                      <Typography variant="body2" color={seatsLeft > 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 'medium' }}>
                        <strong>Seats Left:</strong> {seatsLeft}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      {userEnrollment ? (
                        <IconButton
                          disabled
                          sx={{
                            bgcolor: 'success.50',
                            color: 'success.main',
                          }}
                        >
                          <DoneIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleEnrollClick(formation)}
                          disabled={seatsLeft <= 0}
                          sx={{
                            bgcolor: 'primary.50',
                            color: 'primary.main',
                            '&:hover': { 
                              bgcolor: 'primary.100',
                              transform: 'scale(1.1)',
                            },
                            transition: 'transform 0.2s',
                            '&.Mui-disabled': {
                              bgcolor: 'grey.100',
                              color: 'grey.400',
                            },
                          }}
                        >
                          <EnrollIcon />
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>Confirm Enrollment</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to participate in "{selectedFormation?.title}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmEnroll} variant="contained" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default StudentFormationsList;