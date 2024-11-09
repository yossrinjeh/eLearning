import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Timer as TimerIcon } from '@mui/icons-material';
import { fetchEvaluations } from '../../features/evaluations/evaluationsSlice';
import { fetchEnrollments } from '../../features/enrollments/enrollmentsSlice';
import { fetchStudentEvaluations } from '../../features/studentEvaluations/studentEvaluationsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateRemainingDays = (dateString) => {
  const today = new Date();
  const evalDate = new Date(dateString);
  const diffTime = evalDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const StudentEvaluationView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: evaluations, loading } = useSelector((state) => state.evaluations);
  const { items: enrollments } = useSelector((state) => state.enrollments);
  const { items: studentEvaluations } = useSelector((state) => state.studentEvaluations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchEvaluations());
    dispatch(fetchEnrollments());
    dispatch(fetchStudentEvaluations());
  }, [dispatch]);

  // Get user's enrolled formations
  const userEnrollments = enrollments?.filter(
    enrollment => enrollment.user_id === user?.id && enrollment.status === 'accepted'
  );
  const enrolledFormationIds = userEnrollments?.map(enrollment => enrollment.formation_id);

  // Filter evaluations for enrolled formations
  const userEvaluations = evaluations?.filter(
    evaluation => enrolledFormationIds?.includes(evaluation.formation_id)
  );

  // Get student evaluation results
  const getStudentEvaluation = (evaluationId) => {
    return studentEvaluations?.find(
      se => se.evaluation_id === evaluationId && se.user_id === user?.id
    );
  };

  const handleEvaluationClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setOpenDialog(true);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  // Filter evaluations based on search term
  const filteredEvaluations = userEvaluations?.filter(evaluation =>
    evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          My Evaluations
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search evaluations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredEvaluations?.map((evaluation) => {
              const studentEval = getStudentEvaluation(evaluation.id);
              const remainingDays = calculateRemainingDays(evaluation.date);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={evaluation.id}>
                  <Card 
                    onClick={() => handleEvaluationClick(evaluation)}
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {evaluation.title}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        {evaluation.description}
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Date: {formatDate(evaluation.date)}
                          </Typography>
                          {remainingDays > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <TimerIcon fontSize="small" color="info" />
                              <Typography variant="body2" color="info.main">
                                {remainingDays} days remaining
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {studentEval && (
                          <Chip
                            label={`Score: ${studentEval.score}%`}
                            color={getScoreColor(studentEval.score)}
                            size="small"
                            sx={{ alignSelf: 'flex-start' }}
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Evaluation Details
          </DialogTitle>
          <DialogContent>
            {selectedEvaluation && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedEvaluation.title}
                </Typography>
                <Typography paragraph>
                  {selectedEvaluation.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {formatDate(selectedEvaluation.date)}
                </Typography>
                
                {getStudentEvaluation(selectedEvaluation.id) ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Your Result
                    </Typography>
                    <Stack spacing={2}>
                      <Chip
                        label={`Score: ${getStudentEvaluation(selectedEvaluation.id).score}%`}
                        color={getScoreColor(getStudentEvaluation(selectedEvaluation.id).score)}
                        sx={{ alignSelf: 'flex-start' }}
                      />
                      <Typography>
                        {getStudentEvaluation(selectedEvaluation.id).comments}
                      </Typography>
                    </Stack>
                  </Box>
                ) : (
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    No results available yet
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default StudentEvaluationView; 