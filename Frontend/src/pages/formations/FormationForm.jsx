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
import { createFormation, updateFormation } from '../../features/formations/formationsSlice';
import { fetchRooms } from '../../features/rooms/roomsSlice';
import { fetchTrainers } from '../../features/trainers/trainersSlice';

const FormationForm = ({ formation, onClose }) => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.items);
  const trainers = useSelector((state) => state.trainers.items);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    duration: '',
    max_capacity: '',
    room_id: '',
    trainer_id: '',
    status: 'Pending',
  });

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchTrainers());
  }, [dispatch]);

  useEffect(() => {
    if (formation) {
      setFormData({
        title: formation.title || '',
        description: formation.description || '',
        start_date: formation.start_date?.split('T')[0] || '',
        end_date: formation.end_date?.split('T')[0] || '',
        duration: formation.duration || '',
        max_capacity: formation.max_capacity || '',
        room_id: formation.room_id || '',
        trainer_id: formation.trainer_id || '',
        status: formation.status || 'Pending',
      });
    }
  }, [formation]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = formation
      ? await dispatch(updateFormation({ id: formation.id, data: formData }))
      : await dispatch(createFormation(formData));

    if (!action.error) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            {formation ? 'Edit Formation' : 'Add New Formation'}
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
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Duration (days)"
              name="duration"
              type="number"
              value={formData.duration}
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
              label="Max Capacity"
              name="max_capacity"
              type="number"
              value={formData.max_capacity}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Room</InputLabel>
              <Select
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                label="Room"
                sx={{ borderRadius: 2 }}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name} ({room.capacity} seats)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Trainer</InputLabel>
              <Select
                name="trainer_id"
                value={formData.trainer_id}
                onChange={handleChange}
                label="Trainer"
                sx={{ borderRadius: 2 }}
              >
                {trainers.map((trainer) => (
                  <MenuItem key={trainer.id} value={trainer.id}>
                    {`${trainer.firstname} ${trainer.lastname}`}
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
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
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
          {formation ? 'Update Formation' : 'Create Formation'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default FormationForm; 