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
import { fetchTrainers } from '../../features/trainers/trainersSlice';
import { fetchRooms } from '../../features/rooms/roomsSlice';
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
  const { items: formations, loading, pagination } = useSelector((state) => state.formations);
  const { user } = useSelector((state) => state.auth);
  const [openForm, setOpenForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'ongoing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    dispatch(fetchFormations());
  }, [dispatch]);

  // Filter formations for trainer
  const filteredFormations = formations?.filter(formation => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'trainer') {
      return formation.trainer?.id === user?.id;
    }
    return false;
  });

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

  // Get trainer name function
  const getTrainerName = (trainer) => {
    return trainer ? `${trainer.firstname} ${trainer.lastname}` : 'Not Assigned';
  };

  const getRoomName = (room) => {
    return room ? room.name : 'Not Assigned';
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Formations" 
          onAdd={() => setOpenForm(true)}
          showAddButton={user?.role === 'admin'} 
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
        ) : (
          <Paper 
            sx={{ 
              width: '100%', 
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <TableContainer component={Paper}>
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
                      Trainer
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: '#f8fafc',
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                      }}
                    >
                      Room
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
                  {filteredFormations?.map((formation) => (
                    <TableRow
                      key={formation.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>{formation.title}</TableCell>
                      <TableCell>{formation.description}</TableCell>
                      <TableCell>{formatDate(formation.start_date)}</TableCell>
                      <TableCell>{formatDate(formation.end_date)}</TableCell>
                      <TableCell>{formation.duration}</TableCell>
                      <TableCell>{formation.max_capacity}</TableCell>
                      <TableCell>{getTrainerName(formation.trainer)}</TableCell>
                      <TableCell>{getRoomName(formation.room)}</TableCell>
                      <TableCell>
                        <Chip
                          label={formation.status}
                          color={getStatusColor(formation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(formation)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(formation.id)}
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
                count={pagination?.total || 0}
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
        >
          <FormationForm
            formation={selectedFormation}
            onClose={handleCloseForm}
          />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default FormationsList; 