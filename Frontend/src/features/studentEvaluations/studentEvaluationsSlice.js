import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

export const fetchStudentEvaluations = createAsyncThunk(
  'studentEvaluations/fetchStudentEvaluations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.studentEvaluations.list);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching student evaluations');
    }
  }
);

export const createStudentEvaluation = createAsyncThunk(
  'studentEvaluations/createStudentEvaluation',
  async (evaluationData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.studentEvaluations.create, evaluationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStudentEvaluation = createAsyncThunk(
  'studentEvaluations/updateStudentEvaluation',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(endpoints.studentEvaluations.update(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteStudentEvaluation = createAsyncThunk(
  'studentEvaluations/deleteStudentEvaluation',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.studentEvaluations.delete(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const studentEvaluationsSlice = createSlice({
  name: 'studentEvaluations',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentStudentEvaluation: null,
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
    setCurrentStudentEvaluation: (state, action) => {
      state.currentStudentEvaluation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentEvaluations.fulfilled, (state, action) => {
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
      .addCase(fetchStudentEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStudentEvaluation.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateStudentEvaluation.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (evaluation) => evaluation.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteStudentEvaluation.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (evaluation) => evaluation.id !== action.payload
        );
      });
  },
});

export const { clearError, setCurrentStudentEvaluation } = studentEvaluationsSlice.actions;
export default studentEvaluationsSlice.reducer; 