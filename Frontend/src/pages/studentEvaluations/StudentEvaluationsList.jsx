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
import { fetchEvaluations } from '../../features/evaluations/evaluationsSlice';
import { fetchFormations } from '../../features/formations/formationsSlice';
import { fetchUsers } from '../../features/users/usersSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import StudentEvaluationForm from './StudentEvaluationForm';
import PageHeader from '../../components/PageHeader';

const StudentEvaluationsList = () => {
  const dispatch = useDispatch();
  const { items: studentEvaluations, loading, pagination } = useSelector(
    (state) => state.studentEvaluations
  );
  const evaluations = useSelector((state) => state.evaluations.items);
  const formations = useSelector((state) => state.formations.items);
  const users = useSelector((state) => state.users.items);
  const { user } = useSelector((state) => state.auth);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchStudentEvaluations());
    dispatch(fetchEvaluations());
    dispatch(fetchFormations());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter student evaluations for trainer
  const filteredStudentEvaluations = studentEvaluations?.filter(studentEval => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'trainer') {
      // Find the evaluation
      const evaluation = evaluations.find(e => e.id === studentEval.evaluation_id);
      // Find the formation for this evaluation
      const formation = formations.find(f => f.id === evaluation?.formation_id);
      // Check if the trainer is assigned to this formation
      return formation?.trainer?.id === user?.id;
    }
    return false;
  });

  const getEvaluationTitle = (evaluationId) => {
    const evaluation = evaluations.find(e => e.id === evaluationId);
    return evaluation ? evaluation.title : 'Unknown Evaluation';
  };

  const getFormationTitle = (evaluationId) => {
    const evaluation = evaluations.find(e => e.id === evaluationId);
    const formation = formations.find(f => f.id === evaluation?.formation_id);
    return formation ? formation.title : 'Unknown Formation';
  };

  const getStudentName = (userId) => {
    const student = users.find(u => u.id === userId);
    return student ? `${student.firstname} ${student.lastname}` : 'Unknown Student';
  };

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
          showAddButton={true}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Evaluation</TableCell>
                <TableCell>Formation</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudentEvaluations?.map((studentEval) => (
                <TableRow key={studentEval.id}>
                  <TableCell>{getStudentName(studentEval.user_id)}</TableCell>
                  <TableCell>{getEvaluationTitle(studentEval.evaluation_id)}</TableCell>
                  <TableCell>{getFormationTitle(studentEval.evaluation_id)}</TableCell>
                  <TableCell>{studentEval.score}%</TableCell>
                  <TableCell>{studentEval.comments}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(studentEval)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(studentEval.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination?.total || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          maxWidth="md"
          fullWidth
        >
          <StudentEvaluationForm
            studentEvaluation={selectedEvaluation}
            onClose={handleCloseForm}
          />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default StudentEvaluationsList; 