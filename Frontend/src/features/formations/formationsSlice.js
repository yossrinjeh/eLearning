import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

export const fetchFormations = createAsyncThunk(
  'formations/fetchFormations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.formations.list);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching formations');
    }
  }
);

export const createFormation = createAsyncThunk(
  'formations/createFormation',
  async (formationData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.formations.create, formationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateFormation = createAsyncThunk(
  'formations/updateFormation',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(endpoints.formations.update(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFormation = createAsyncThunk(
  'formations/deleteFormation',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.formations.delete(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const formationsSlice = createSlice({
  name: 'formations',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentFormation: null,
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
    setCurrentFormation: (state, action) => {
      state.currentFormation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormations.fulfilled, (state, action) => {
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
      .addCase(fetchFormations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFormation.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateFormation.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (formation) => formation.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteFormation.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (formation) => formation.id !== action.payload
        );
      });
  },
});

export const { clearError, setCurrentFormation } = formationsSlice.actions;
export default formationsSlice.reducer; 