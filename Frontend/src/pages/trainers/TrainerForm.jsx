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
} from '@mui/material';
import { createTrainer, updateTrainer } from '../../features/trainers/trainersSlice';

const TrainerForm = ({ trainer, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    specialities: '',
    experience: '',
    cv_path: '',
    user_id: '',
  });

  useEffect(() => {
    if (trainer) {
      setFormData({
        specialities: trainer.specialities || '',
        experience: trainer.experience || '',
        cv_path: trainer.cv_path || '',
        user_id: trainer.user_id || '',
      });
    }
  }, [trainer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = trainer
      ? await dispatch(updateTrainer({ id: trainer.id, data: formData }))
      : await dispatch(createTrainer(formData));

    if (!action.error) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {trainer ? 'Edit Trainer Profile' : 'Add New Trainer Profile'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Grid container spacing={2}>
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
                fullWidth
                label="Specialities"
                name="specialities"
                value={formData.specialities}
                onChange={handleChange}
                multiline
                rows={2}
                helperText="Enter specialities separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CV Path"
                name="cv_path"
                value={formData.cv_path}
                onChange={handleChange}
                helperText="Enter the path to the CV file"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {trainer ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default TrainerForm; 