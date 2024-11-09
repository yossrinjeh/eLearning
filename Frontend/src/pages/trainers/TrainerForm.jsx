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
import { createTrainer, updateTrainer } from '../../features/trainers/trainersSlice';
import { fetchUsers } from '../../features/users/usersSlice';

const TrainerForm = ({ trainer, onClose }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.items);
  
  const [formData, setFormData] = useState({
    user_id: '',
    specialities: '',
    experience: '',
    cv_path: '',
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (trainer) {
      setFormData({
        user_id: trainer.user_id || '',
        specialities: trainer.specialities || '',
        experience: trainer.experience || '',
        cv_path: trainer.cv_path || '',
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
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            {trainer ? 'Edit Trainer' : 'Add New Trainer'}
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
            <FormControl fullWidth required>
              <InputLabel>User</InputLabel>
              <Select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                label="User"
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
            <TextField
              fullWidth
              label="CV Path"
              name="cv_path"
              value={formData.cv_path}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              helperText="Enter the path to the CV file"
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
          {trainer ? 'Update Trainer' : 'Create Trainer'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default TrainerForm; 