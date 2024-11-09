import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

// Async thunks
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.rooms.list);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching rooms');
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.rooms.create, roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(endpoints.rooms.update(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.rooms.delete(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentRoom: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 10,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (action.payload.meta) {
          state.pagination = {
            currentPage: action.payload.meta.current_page,
            totalPages: action.payload.meta.last_page,
            totalItems: action.payload.meta.total,
            perPage: action.payload.meta.per_page,
          };
        }
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create room
      .addCase(createRoom.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update room
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (room) => room.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.items = state.items.filter((room) => room.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentRoom } = roomsSlice.actions;
export default roomsSlice.reducer; 