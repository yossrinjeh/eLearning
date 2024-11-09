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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { createEvaluation, updateEvaluation } from '../../features/evaluations/evaluationsSlice';

const EvaluationForm = ({ evaluation, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    formation_id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    is_active: true,
  });

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
      <DialogTitle>
        {evaluation ? 'Edit Evaluation' : 'Add New Evaluation'}
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
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleChange}
                    name="is_active"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {evaluation ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default EvaluationForm; 