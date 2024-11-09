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
import { fetchFormations, deleteFormation } from '../../features/formations/formationsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import FormationForm from './FormationForm';
import PageHeader from '../../components/PageHeader';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const FormationsList = () => {
  const dispatch = useDispatch();
  const { items: formations, loading, error, pagination } = useSelector(
    (state) => state.formations
  );
  const [openForm, setOpenForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Active':
        return 'success';
      case 'Completed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Formations" 
          onAdd={() => setOpenForm(true)} 
        />

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search formations..."
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
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Title
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Start Date
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      End Date
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Duration
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Capacity
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(formations) && formations.length > 0 ? (
                    formations.map((formation) => (
                      <TableRow 
                        key={formation.id}
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8fafc',
                          },
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="medium">{formation.title}</Typography>
                        </TableCell>
                        <TableCell>{formation.description}</TableCell>
                        <TableCell>{formatDate(formation.start_date)}</TableCell>
                        <TableCell>{formatDate(formation.end_date)}</TableCell>
                        <TableCell>{formation.duration} days</TableCell>
                        <TableCell>{formation.max_capacity}</TableCell>
                        <TableCell>
                          <Chip
                            label={formation.status}
                            color={getStatusColor(formation.status)}
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                              onClick={() => handleEdit(formation)}
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
                              onClick={() => handleDelete(formation.id)}
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
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          No formations available
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
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }
          }}
        >
          <FormationForm formation={selectedFormation} onClose={handleCloseForm} />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default FormationsList; 