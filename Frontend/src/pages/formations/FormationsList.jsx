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
import { fetchFormations, deleteFormation } from '../../features/formations/formationsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import FormationForm from './FormationForm';

const FormationsList = () => {
  const dispatch = useDispatch();
  const { items: formations, loading, error, pagination } = useSelector(
    (state) => state.formations
  );
  const [openForm, setOpenForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchFormations());
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (formation) => {
    setSelectedFormation(formation);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this formation?')) {
      await dispatch(deleteFormation(id));
      dispatch(fetchFormations());
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedFormation(null);
    dispatch(fetchFormations());
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
          Formations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenForm(true)}
        >
          Add New Formation
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
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(formations) && formations.length > 0 ? (
                  formations.map((formation) => (
                    <TableRow key={formation.id}>
                      <TableCell>{formation.title}</TableCell>
                      <TableCell>{formation.description}</TableCell>
                      <TableCell>{formation.start_date}</TableCell>
                      <TableCell>{formation.end_date}</TableCell>
                      <TableCell>{formation.duration} days</TableCell>
                      <TableCell>{formation.max_capacity}</TableCell>
                      <TableCell>{formation.status}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(formation)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(formation.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No formations available
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

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <FormationForm formation={selectedFormation} onClose={handleCloseForm} />
      </Dialog>
    </DashboardLayout>
  );
};

export default FormationsList; 