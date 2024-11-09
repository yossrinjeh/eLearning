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
import { fetchTrainers, deleteTrainer } from '../../features/trainers/trainersSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import TrainerForm from './TrainerForm';
import PageHeader from '../../components/PageHeader';

const TrainersList = () => {
  const dispatch = useDispatch();
  const { items: trainers, loading, error, pagination } = useSelector(
    (state) => state.trainers
  );
  const [openForm, setOpenForm] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (trainer) => {
    setSelectedTrainer(trainer);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      await dispatch(deleteTrainer(id));
      dispatch(fetchTrainers());
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedTrainer(null);
    dispatch(fetchTrainers());
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
          title="Trainers" 
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
                    <TableCell>Name</TableCell>
                    <TableCell>Specialities</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>CV</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(trainers) && trainers.length > 0 ? (
                    trainers.map((trainer) => (
                      <TableRow key={trainer.id}>
                        <TableCell>{trainer.user?.firstname} {trainer.user?.lastname}</TableCell>
                        <TableCell>{trainer.specialities}</TableCell>
                        <TableCell>{trainer.experience}</TableCell>
                        <TableCell>
                          {trainer.cv_path && (
                            <Button
                              size="small"
                              variant="outlined"
                              href={trainer.cv_path}
                              target="_blank"
                            >
                              View CV
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(trainer)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(trainer.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No trainers available
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
          <TrainerForm trainer={selectedTrainer} onClose={handleCloseForm} />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default TrainersList; 