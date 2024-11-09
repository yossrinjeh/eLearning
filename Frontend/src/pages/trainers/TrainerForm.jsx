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
  IconButton,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Link,
} from '@mui/material';
import { Close as CloseIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { updateTrainer } from '../../features/trainers/trainersSlice';

const TrainerForm = ({ trainer, onClose }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    specialities: '',
    experience: '',
    is_active: false,
  });

  useEffect(() => {
    if (trainer) {
      setFormData({
        specialities: trainer.trainer_profile?.specialities || '',
        experience: trainer.trainer_profile?.experience || '',
        is_active: trainer.is_active || false,
      });
    }
  }, [trainer]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = await dispatch(updateTrainer({ id: trainer.id, data: formData }));
    if (!action.error) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            Edit Trainer Profile
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
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Name:</strong> {trainer?.firstname} {trainer?.lastname}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Email:</strong> {trainer?.email}
            </Typography>
            {trainer?.trainer_profile?.cv_path && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PdfIcon color="error" />
                <Link 
                  href={`https://elearning.test/storage/${trainer.trainer_profile.cv_path}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none' }}
                >
                  View CV
                </Link>
              </Box>
            )}
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
              InputProps={{
                sx: { borderRadius: 2 }
              }}
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
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleChange}
                  name="is_active"
                  color="success"
                />
              }
              label={formData.is_active ? "Active" : "Inactive"}
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
          Update Trainer
        </Button>
      </DialogActions>
    </form>
  );
};

export default TrainerForm; 