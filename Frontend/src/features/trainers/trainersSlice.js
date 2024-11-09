import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

export const fetchTrainers = createAsyncThunk(
  'trainers/fetchTrainers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.trainers.list);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching trainers');
    }
  }
);

export const createTrainer = createAsyncThunk(
  'trainers/createTrainer',
  async (trainerData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.trainers.create, trainerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTrainer = createAsyncThunk(
  'trainers/updateTrainer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(endpoints.trainers.update(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTrainer = createAsyncThunk(
  'trainers/deleteTrainer',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.trainers.delete(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const trainersSlice = createSlice({
  name: 'trainers',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentTrainer: null,
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
    setCurrentTrainer: (state, action) => {
      state.currentTrainer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
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
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTrainer.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (trainer) => trainer.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTrainer.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (trainer) => trainer.id !== action.payload
        );
      });
  },
});

export const { clearError, setCurrentTrainer } = trainersSlice.actions;
export default trainersSlice.reducer; 