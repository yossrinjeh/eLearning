import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Grid,
} from '@mui/material';
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
      <DialogTitle>
        {enrollment ? 'Edit Enrollment' : 'Add New Enrollment'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Formation ID"
                name="formation_id"
                type="number"
                value={formData.formation_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="User ID"
                name="user_id"
                type="number"
                value={formData.user_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Enrollment Date"
                name="enrollment_date"
                type="date"
                value={formData.enrollment_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {enrollment ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default EnrollmentForm; 