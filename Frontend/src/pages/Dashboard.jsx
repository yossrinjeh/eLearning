import { useEffect } from 'react';
import { Typography, Grid, Paper, Box, Chip, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardLayout';
import { fetchFormations } from '../features/formations/formationsSlice';
import { fetchEvaluations } from '../features/evaluations/evaluationsSlice';
import { fetchStudentEvaluations } from '../features/studentEvaluations/studentEvaluationsSlice';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: formations, loading: formationsLoading } = useSelector((state) => state.formations);
  const { items: evaluations, loading: evaluationsLoading } = useSelector((state) => state.evaluations);
  const { items: studentEvaluations, loading: studentEvaluationsLoading } = useSelector((state) => state.studentEvaluations);

  useEffect(() => {
    dispatch(fetchFormations());
    dispatch(fetchEvaluations());
    dispatch(fetchStudentEvaluations());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'ongoing':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  // Filter formations for trainer
  const trainerFormations = formations?.filter(
    formation => formation.trainer_id === user?.id
  );

  // Filter evaluations for trainer's formations
  const trainerEvaluations = evaluations?.filter(
    evaluation => trainerFormations?.some(f => f.id === evaluation.formation_id)
  );

  // Filter student evaluations for trainer's evaluations
  const trainerStudentEvaluations = studentEvaluations?.filter(
    se => trainerEvaluations?.some(e => e.id === se.evaluation_id)
  );

  const loading = formationsLoading || evaluationsLoading || studentEvaluationsLoading;

  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {user?.role === 'trainer' && (
            <>
              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    My Formations
                  </Typography>
                  {trainerFormations?.length > 0 ? (
                    trainerFormations.slice(0, 5).map((formation) => (
                      <Box key={formation.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {formation.title}
                        </Typography>
                        <Chip
                          label={formation.status}
                          color={getStatusColor(formation.status)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">No formations assigned</Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Recent Evaluations
                  </Typography>
                  {trainerEvaluations?.length > 0 ? (
                    trainerEvaluations.slice(0, 5).map((evaluation) => (
                      <Box key={evaluation.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {evaluation.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {formatDate(evaluation.date)}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">No evaluations created</Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Recent Student Results
                  </Typography>
                  {trainerStudentEvaluations?.length > 0 ? (
                    trainerStudentEvaluations.slice(0, 5).map((se) => (
                      <Box key={se.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Student: {se.user_id}
                        </Typography>
                        <Chip
                          label={`Score: ${se.score}%`}
                          color={getScoreColor(se.score)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">No student evaluations yet</Typography>
                  )}
                </Paper>
              </Grid>
            </>
          )}
          
          {user?.role === 'student' && (
            <>
              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    My Evaluations
                  </Typography>
                  {studentEvaluations?.length > 0 ? (
                    studentEvaluations.slice(0, 5).map((evaluation) => (
                      <Box key={evaluation.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {evaluation.title}
                        </Typography>
                        <Chip
                          label={`Score: ${evaluation.score}%`}
                          color={getScoreColor(evaluation.score)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">No evaluations available</Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    My Formations
                  </Typography>
                  {formations?.length > 0 ? (
                    formations.slice(0, 5).map((formation) => (
                      <Box key={formation.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {formation.title}
                        </Typography>
                        <Chip
                          label={formation.status}
                          color={getStatusColor(formation.status)}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">No formations enrolled</Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Recent Activities
                  </Typography>
                  <Typography color="text.secondary">No recent activities</Typography>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default Dashboard; 