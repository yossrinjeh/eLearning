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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchStudentEvaluations, deleteStudentEvaluation } from '../../features/studentEvaluations/studentEvaluationsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import StudentEvaluationForm from './StudentEvaluationForm';

const StudentEvaluationsList = () => {
  const dispatch = useDispatch();
  const { items: evaluations, loading, error, pagination } = useSelector(
    (state) => state.studentEvaluations
  );
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Student Evaluations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenForm(true)}
        >
          Add New Student Evaluation
        </Button>
      </Box>

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
                  <TableCell>Evaluation</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(evaluations) && evaluations.length > 0 ? (
                  evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>{evaluation.evaluation_id}</TableCell>
                      <TableCell>{evaluation.user_id}</TableCell>
                      <TableCell>{evaluation.score}</TableCell>
                      <TableCell>{evaluation.comments}</TableCell>
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
                    <TableCell colSpan={5} align="center">
                      No student evaluations available
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
        <StudentEvaluationForm
          evaluation={selectedEvaluation}
          onClose={handleCloseForm}
        />
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentEvaluationsList; 