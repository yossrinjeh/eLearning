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
  const { user } = useSelector((state) => state.auth);
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
    status: 'pending',
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
        start_date: formation.start_date ? formation.start_date.split('T')[0] : '',
        end_date: formation.end_date ? formation.end_date.split('T')[0] : '',
        duration: formation.duration?.toString() || '',
        max_capacity: formation.max_capacity?.toString() || '',
        room_id: formation.room?.id || '',
        trainer_id: formation.trainer?.id || '',
        status: formation.status || 'pending',
      });
    }
  }, [formation]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' || e.target.name === 'room_id' || e.target.name === 'trainer_id'
      ? Number(e.target.value)
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value,
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
      <DialogTitle>
        {formation ? 'Edit Formation' : 'Add New Formation'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (hours)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Capacity"
              name="max_capacity"
              type="number"
              value={formData.max_capacity}
              onChange={handleChange}
              required
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
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
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
              >
                {trainers.map((trainer) => (
                  <MenuItem key={trainer.id} value={trainer.id}>
                    {`${trainer.firstname} ${trainer.lastname}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {formation ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default FormationForm; 