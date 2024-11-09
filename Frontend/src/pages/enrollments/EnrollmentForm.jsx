import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createEnrollment, updateEnrollment } from '../../features/enrollments/enrollmentsSlice';
import { fetchFormations } from '../../features/formations/formationsSlice';
import { fetchUsers } from '../../features/users/usersSlice';

const EnrollmentForm = ({ enrollment, onClose }) => {
  const dispatch = useDispatch();
  const formations = useSelector((state) => state.formations.items);
  const users = useSelector((state) => state.users.items);
  
  const [formData, setFormData] = useState({
    formation_id: '',
    user_id: '',
    status: 'pending',
    enrollment_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    // Fetch formations and users when component mounts
    dispatch(fetchFormations());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (enrollment) {
      setFormData({
        formation_id: enrollment.formation_id || '',
        user_id: enrollment.user_id || '',
        status: enrollment.status || 'pending',
        enrollment_date: enrollment.enrollment_date?.split('T')[0] || new Date().toISOString().split('T')[0],
      });
    }
  }, [enrollment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = enrollment
      ? await dispatch(updateEnrollment({ id: enrollment.id, data: formData }))
      : await dispatch(createEnrollment(formData));

    if (!action.error) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            {enrollment ? 'Edit Enrollment' : 'Add New Enrollment'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Formation</InputLabel>
              <Select
                name="formation_id"
                value={formData.formation_id}
                onChange={handleChange}
                label="Formation"
                sx={{ borderRadius: 2 }}
              >
                {formations.map((formation) => (
                  <MenuItem key={formation.id} value={formation.id}>
                    {formation.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Student</InputLabel>
              <Select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                label="Student"
                sx={{ borderRadius: 2 }}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Enrollment Date"
              name="enrollment_date"
              type="date"
              value={formData.enrollment_date}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium',
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium',
          }}
        >
          {enrollment ? 'Update Enrollment' : 'Create Enrollment'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default EnrollmentForm; 