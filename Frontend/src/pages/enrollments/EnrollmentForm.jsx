import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createEnrollment, updateEnrollment } from '../../features/enrollments/enrollmentsSlice';

const EnrollmentForm = ({ enrollment, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    formation_id: '',
    user_id: '',
    status: 'pending',
    enrollment_date: new Date().toISOString().split('T')[0],
  });

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
            <TextField
              required
              fullWidth
              label="Formation ID"
              name="formation_id"
              type="number"
              value={formData.formation_id}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="User ID"
              name="user_id"
              type="number"
              value={formData.user_id}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
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