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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createEvaluation, updateEvaluation } from '../../features/evaluations/evaluationsSlice';
import { fetchFormations } from '../../features/formations/formationsSlice';

const EvaluationForm = ({ evaluation, onClose }) => {
  const dispatch = useDispatch();
  const formations = useSelector((state) => state.formations.items);
  
  const [formData, setFormData] = useState({
    formation_id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    is_active: true,
  });

  useEffect(() => {
    dispatch(fetchFormations());
  }, [dispatch]);

  useEffect(() => {
    if (evaluation) {
      setFormData({
        formation_id: evaluation.formation_id || '',
        title: evaluation.title || '',
        description: evaluation.description || '',
        date: evaluation.date?.split('T')[0] || new Date().toISOString().split('T')[0],
        is_active: evaluation.is_active ?? true,
      });
    }
  }, [evaluation]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
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
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleChange}
                  name="is_active"
                  color="success"
                />
              }
              label="Active"
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
          {evaluation ? 'Update Evaluation' : 'Create Evaluation'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default EvaluationForm; 