import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  CircularProgress,
  TablePagination,
  Chip,
  Stack,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { fetchStudentEvaluations, deleteStudentEvaluation } from '../../features/studentEvaluations/studentEvaluationsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import StudentEvaluationForm from './StudentEvaluationForm';
import PageHeader from '../../components/PageHeader';

const StudentEvaluationsList = () => {
  const dispatch = useDispatch();
  const { items: evaluations, loading, error, pagination } = useSelector(
    (state) => state.studentEvaluations
  );
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchStudentEvaluations());
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      await dispatch(deleteStudentEvaluation(id));
      dispatch(fetchStudentEvaluations());
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEvaluation(null);
    dispatch(fetchStudentEvaluations());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Student Evaluations" 
          onAdd={() => setOpenForm(true)} 
        />

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search student evaluations..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper 
            sx={{ 
              p: 3, 
              bgcolor: '#FEE2E2', 
              color: '#DC2626',
              borderRadius: 2,
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        ) : (
          <Paper 
            sx={{ 
              width: '100%', 
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Evaluation', 'Student', 'Score', 'Comments', 'Actions'].map((header) => (
                      <TableCell 
                        key={header}
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: '#f8fafc',
                          borderBottom: '2px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(evaluations) && evaluations.length > 0 ? (
                    evaluations.map((evaluation) => (
                      <TableRow 
                        key={evaluation.id}
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8fafc',
                          },
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="medium">{evaluation.evaluation_id}</Typography>
                        </TableCell>
                        <TableCell>{evaluation.user_id}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${evaluation.score}%`}
                            color={evaluation.score >= 70 ? 'success' : evaluation.score >= 50 ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                          />
                        </TableCell>
                        <TableCell>{evaluation.comments}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              onClick={() => handleEdit(evaluation)}
                              size="small"
                              sx={{
                                bgcolor: 'primary.50',
                                color: 'primary.main',
                                '&:hover': { 
                                  bgcolor: 'primary.100',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'transform 0.2s',
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(evaluation.id)}
                              size="small"
                              sx={{
                                bgcolor: 'error.50',
                                color: 'error.main',
                                '&:hover': { 
                                  bgcolor: 'error.100',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'transform 0.2s',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          No student evaluations available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box 
              sx={{ 
                p: 2, 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: '#f8fafc',
              }}
            >
              <TablePagination
                component="div"
                count={pagination.totalItems}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '.MuiTablePagination-select': {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Paper>
        )}

        <Dialog 
          open={openForm} 
          onClose={handleCloseForm} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }
          }}
        >
          <StudentEvaluationForm
            evaluation={selectedEvaluation}
            onClose={handleCloseForm}
          />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default StudentEvaluationsList; 