import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import endpoints from '../../config/endpoints';

export const fetchEnrollments = createAsyncThunk(
  'enrollments/fetchEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.enrollments.list);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching enrollments');
    }
  }
);

export const createEnrollment = createAsyncThunk(
  'enrollments/createEnrollment',
  async (enrollmentData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.enrollments.create, enrollmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEnrollment = createAsyncThunk(
  'enrollments/updateEnrollment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(endpoints.enrollments.update(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEnrollment = createAsyncThunk(
  'enrollments/deleteEnrollment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.enrollments.delete(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentEnrollment: null,
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
    setCurrentEnrollment: (state, action) => {
      state.currentEnrollment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
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
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEnrollment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateEnrollment.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (enrollment) => enrollment.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteEnrollment.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (enrollment) => enrollment.id !== action.payload
        );
      });
  },
});

export const { clearError, setCurrentEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer; 