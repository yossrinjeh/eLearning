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
import { createStudentEvaluation, updateStudentEvaluation } from '../../features/studentEvaluations/studentEvaluationsSlice';

const StudentEvaluationForm = ({ evaluation, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    evaluation_id: '',
    user_id: '',
    score: '',
    comments: '',
  });

  useEffect(() => {
    if (evaluation) {
      setFormData({
        evaluation_id: evaluation.evaluation_id || '',
        user_id: evaluation.user_id || '',
        score: evaluation.score || '',
        comments: evaluation.comments || '',
      });
    }
  }, [evaluation]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = evaluation
      ? await dispatch(updateStudentEvaluation({ id: evaluation.id, data: formData }))
      : await dispatch(createStudentEvaluation(formData));

    if (!action.error) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {evaluation ? 'Edit Student Evaluation' : 'Add New Student Evaluation'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Evaluation ID"
                name="evaluation_id"
                type="number"
                value={formData.evaluation_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Student ID"
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
                label="Score"
                name="score"
                type="number"
                inputProps={{ step: "0.1", min: "0", max: "100" }}
                value={formData.score}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Comments"
                name="comments"
                multiline
                rows={3}
                value={formData.comments}
                onChange={handleChange}
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

export default StudentEvaluationForm; 