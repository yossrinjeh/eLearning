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
  const { items: evaluations, loading, pagination } = useSelector(
    (state) => state.evaluations
  );
  const formations = useSelector((state) => state.formations.items);
  const { user } = useSelector((state) => state.auth);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEvaluations());
    dispatch(fetchFormations());
  }, [dispatch]);

  const filteredEvaluations = evaluations?.filter(evaluation => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'trainer') {
      const formation = formations.find(f => f.id === evaluation.formation_id);
      return formation?.trainer?.id === user?.id;
    }
    return false;
  });

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

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Evaluations" 
          onAdd={() => setOpenForm(true)}
          showAddButton={true}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Formation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvaluations?.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.title}</TableCell>
                  <TableCell>{evaluation.description}</TableCell>
                  <TableCell>{formatDate(evaluation.date)}</TableCell>
                  <TableCell>{getFormationTitle(evaluation.formation_id)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(evaluation)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(evaluation.id)}
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
          <EvaluationForm
            evaluation={selectedEvaluation}
            onClose={handleCloseForm}
          />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default EvaluationsList; 