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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchEvaluations, deleteEvaluation } from '../../features/evaluations/evaluationsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import EvaluationForm from './EvaluationForm';
import PageHeader from '../../components/PageHeader';

const EvaluationsList = () => {
  const dispatch = useDispatch();
  const { items: evaluations, loading, error, pagination } = useSelector(
    (state) => state.evaluations
  );
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchEvaluations());
  }, [dispatch, page, rowsPerPage]);

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

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Evaluations" 
          onAdd={() => setOpenForm(true)} 
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Formation</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(evaluations) && evaluations.length > 0 ? (
                    evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>{evaluation.formation_id}</TableCell>
                        <TableCell>{evaluation.title}</TableCell>
                        <TableCell>{evaluation.description}</TableCell>
                        <TableCell>{evaluation.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={evaluation.is_active ? 'Active' : 'Inactive'}
                            color={evaluation.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(evaluation)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(evaluation.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No evaluations available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={pagination.totalItems}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

        <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
          <EvaluationForm evaluation={selectedEvaluation} onClose={handleCloseForm} />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default EvaluationsList; 