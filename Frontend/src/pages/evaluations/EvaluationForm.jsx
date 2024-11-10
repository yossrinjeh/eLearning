import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createEvaluation, updateEvaluation } from '../../features/evaluations/evaluationsSlice';
import { fetchFormations } from '../../features/formations/formationsSlice';

const EvaluationForm = ({ evaluation, onClose }) => {
  const dispatch = useDispatch();
  const formations = useSelector((state) => state.formations.items);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    formation_id: '',
    is_active: true,
  });

  useEffect(() => {
    dispatch(fetchFormations());
    if (evaluation) {
      setFormData({
        title: evaluation.title || '',
        description: evaluation.description || '',
        date: evaluation.date?.split('T')[0] || '',
        formation_id: evaluation.formation_id || '',
        is_active: evaluation.is_active ?? true,
      });
    }
  }, [evaluation, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = evaluation
      ? await dispatch(updateEvaluation({ id: evaluation.id, data: formData }))
      : await dispatch(createEvaluation(formData));

    if (!action.error) {
      onClose();
    }
  };

  // Filter formations based on user role
  const filteredFormations = formations?.filter(formation => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'trainer') {
      return formation.trainer?.id === user?.id;
    }
    return false;
  });

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            {evaluation ? 'Edit Evaluation' : 'Add New Evaluation'}
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
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Formation</InputLabel>
              <Select
                name="formation_id"
                value={formData.formation_id}
                onChange={handleChange}
                label="Formation"
              >
                {filteredFormations.map((formation) => (
                  <MenuItem key={formation.id} value={formation.id}>
                    {formation.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {evaluation ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default EvaluationForm; 