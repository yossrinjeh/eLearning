import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetchEvaluations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.evaluations.list);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching evaluations');
    }
  }
);

export const createEvaluation = createAsyncThunk(
  'evaluations/createEvaluation',
  async (evaluationData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.evaluations.create, evaluationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  'evaluations/updateEvaluation',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(endpoints.evaluations.update(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEvaluation = createAsyncThunk(
  'evaluations/deleteEvaluation',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.evaluations.delete(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentEvaluation: null,
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
    setCurrentEvaluation: (state, action) => {
      state.currentEvaluation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
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
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (evaluation) => evaluation.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (evaluation) => evaluation.id !== action.payload
        );
      });
  },
});

export const { clearError, setCurrentEvaluation } = evaluationsSlice.actions;
export default evaluationsSlice.reducer; 