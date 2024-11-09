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
import { fetchEnrollments, deleteEnrollment } from '../../features/enrollments/enrollmentsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import EnrollmentForm from './EnrollmentForm';
import PageHeader from '../../components/PageHeader';

const EnrollmentsList = () => {
  const dispatch = useDispatch();
  const { items: enrollments, loading, error, pagination } = useSelector(
    (state) => state.enrollments
  );
  const [openForm, setOpenForm] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchEnrollments());
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      await dispatch(deleteEnrollment(id));
      dispatch(fetchEnrollments());
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEnrollment(null);
    dispatch(fetchEnrollments());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Enrollments" 
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
                    <TableCell>User</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Enrollment Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(enrollments) && enrollments.length > 0 ? (
                    enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.formation_id}</TableCell>
                        <TableCell>{enrollment.user_id}</TableCell>
                        <TableCell>
                          <Chip
                            label={enrollment.status}
                            color={getStatusColor(enrollment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{enrollment.enrollment_date}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(enrollment)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(enrollment.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No enrollments available
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
          <EnrollmentForm enrollment={selectedEnrollment} onClose={handleCloseForm} />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default EnrollmentsList; 