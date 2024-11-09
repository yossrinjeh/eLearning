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
  Card,
  Chip,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { fetchRooms, deleteRoom } from '../../features/rooms/roomsSlice';
import DashboardLayout from '../../layouts/DashboardLayout';
import RoomForm from './RoomForm';
import PageHeader from '../../components/PageHeader';

const RoomsList = () => {
  const dispatch = useDispatch();
  const { items: rooms, loading, error, pagination } = useSelector((state) => state.rooms);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      await dispatch(deleteRoom(id));
      dispatch(fetchRooms());
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedRoom(null);
    dispatch(fetchRooms());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredRooms = rooms?.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.equipment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <PageHeader 
          title="Rooms" 
          onAdd={() => setOpenForm(true)} 
        />

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search rooms by name or equipment..."
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
                      Name
                    </TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Equipment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRooms?.map((room) => (
                    <TableRow 
                      key={room.id} 
                      hover
                      sx={{
                        '&:hover': {
                          bgcolor: '#f8fafc',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">{room.name}</Typography>
                      </TableCell>
                      <TableCell>{room.capacity} seats</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {room.equipment}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={room.status}
                          color={getStatusColor(room.status)}
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            onClick={() => handleEdit(room)}
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
                            onClick={() => handleDelete(room.id)}
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
          <RoomForm room={selectedRoom} onClose={handleCloseForm} />
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default RoomsList; 