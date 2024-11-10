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
import { fetchEvaluations, deleteEvaluation } from '../../features/evaluations/evaluationsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import EvaluationForm from './EvaluationForm';
import PageHeader from '../../components/PageHeader';
import { fetchFormations } from '../../features/formations/formationsSlice';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const EvaluationsList = () => {
  const dispatch = useDispatch();
  const { items: evaluations, loading, error, pagination } = useSelector(
    (state) => state.evaluations
  );
  const formations = useSelector((state) => state.formations.items);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvaluations());
    dispatch(fetchFormations());
  }, [dispatch, page, rowsPerPage]);

  const getFormationTitle = (formationId) => {
    const formation = formations.find(f => f.id === formationId);
    return formation ? formation.title : 'Unknown Formation';
  };

  const handleEdit = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      await dispatch(deleteEvaluation(id));
      dispatch(fetchEvaluations());
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEvaluation(null);
    dispatch(fetchEvaluations());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredEvaluations = evaluations?.filter(evaluation => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'trainer') {
      const formation = formations.find(f => f.id === evaluation.formation_id);
      return formation?.trainer_id === user?.id;
    }
    return false;
  });

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Evaluations" 
          onAdd={() => setOpenForm(true)} 
        />

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search evaluations..."
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
                    {['Formation', 'Title', 'Description', 'Date', 'Status', 'Actions'].map((header) => (
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
                  {Array.isArray(filteredEvaluations) && filteredEvaluations.length > 0 ? (
                    filteredEvaluations.map((evaluation) => (
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
                          <Typography fontWeight="medium">
                            {getFormationTitle(evaluation.formation_id)}
                          </Typography>
                        </TableCell>
                        <TableCell>{evaluation.title}</TableCell>
                        <TableCell>{evaluation.description}</TableCell>
                        <TableCell>{formatDate(evaluation.date)}</TableCell>
                        <TableCell>
                          <Chip
                            label={evaluation.is_active ? 'Active' : 'Inactive'}
                            color={evaluation.is_active ? 'success' : 'default'}
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                          />
                        </TableCell>
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
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          No evaluations available
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
          <EvaluationForm evaluation={selectedEvaluation} onClose={handleCloseForm} />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default EvaluationsList; 