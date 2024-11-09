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
  IconButton,
  Typography,
  Box,
  Dialog,
  CircularProgress,
  TablePagination,
  Chip,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
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
  const [searchTerm, setSearchTerm] = useState('');

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

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search enrollments..."
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
                    {['Formation', 'User', 'Status', 'Enrollment Date', 'Actions'].map((header) => (
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
                  {Array.isArray(enrollments) && enrollments.length > 0 ? (
                    enrollments.map((enrollment) => (
                      <TableRow 
                        key={enrollment.id}
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8fafc',
                          },
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="medium">{enrollment.formation_id}</Typography>
                        </TableCell>
                        <TableCell>{enrollment.user_id}</TableCell>
                        <TableCell>
                          <Chip
                            label={enrollment.status}
                            color={getStatusColor(enrollment.status)}
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                          />
                        </TableCell>
                        <TableCell>{enrollment.enrollment_date}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              onClick={() => handleEdit(enrollment)}
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
                              onClick={() => handleDelete(enrollment.id)}
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
                          No enrollments available
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
          <EnrollmentForm enrollment={selectedEnrollment} onClose={handleCloseForm} />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default EnrollmentsList;