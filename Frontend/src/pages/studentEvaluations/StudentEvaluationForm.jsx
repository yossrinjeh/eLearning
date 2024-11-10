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
import { createStudentEvaluation, updateStudentEvaluation } from '../../features/studentEvaluations/studentEvaluationsSlice';
import { fetchEvaluations } from '../../features/evaluations/evaluationsSlice';
import { fetchUsers } from '../../features/users/usersSlice';

const StudentEvaluationForm = ({ studentEvaluation, onClose }) => {
  const dispatch = useDispatch();
  const evaluations = useSelector((state) => state.evaluations.items);
  const users = useSelector((state) => state.users.items);
  const { user } = useSelector((state) => state.auth);
  const formations = useSelector((state) => state.formations.items);
  
  const [formData, setFormData] = useState({
    evaluation_id: '',
    user_id: '',
    score: '',
    comments: '',
  });

  useEffect(() => {
    dispatch(fetchEvaluations());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (studentEvaluation) {
      setFormData({
        evaluation_id: studentEvaluation.evaluation_id || '',
        user_id: studentEvaluation.user_id || '',
        score: studentEvaluation.score || '',
        comments: studentEvaluation.comments || '',
      });
    }
  }, [studentEvaluation]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = studentEvaluation
      ? await dispatch(updateStudentEvaluation({ id: studentEvaluation.id, data: formData }))
      : await dispatch(createStudentEvaluation(formData));

    if (!action.error) {
      onClose();
    }
  };

  // Filter evaluations based on trainer's formations
  const filteredEvaluations = evaluations.filter(evaluation => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'trainer') {
      const formation = formations.find(f => f.id === evaluation.formation_id);
      return formation?.trainer_id === user?.id;
    }
    return false;
  });

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            {studentEvaluation ? 'Edit Student Evaluation' : 'Add New Student Evaluation'}
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Evaluation</InputLabel>
              <Select
                name="evaluation_id"
                value={formData.evaluation_id}
                onChange={handleChange}
                label="Evaluation"
                sx={{ borderRadius: 2 }}
              >
                {filteredEvaluations.map((evaluation) => (
                  <MenuItem key={evaluation.id} value={evaluation.id}>
                    {evaluation.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Student</InputLabel>
              <Select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                label="Student"
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
              label="Score"
              name="score"
              type="number"
              value={formData.score}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 },
                inputProps: { min: 0, max: 100 }
              }}
              helperText="Score should be between 0 and 100"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              multiline
              rows={3}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
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
          {studentEvaluation ? 'Update Evaluation' : 'Create Evaluation'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default StudentEvaluationForm; 