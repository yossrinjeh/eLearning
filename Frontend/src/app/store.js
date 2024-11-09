import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import roomsReducer from '../features/rooms/roomsSlice';
import formationsReducer from '../features/formations/formationsSlice';
import enrollmentsReducer from '../features/enrollments/enrollmentsSlice';
import evaluationsReducer from '../features/evaluations/evaluationsSlice';
import studentEvaluationsReducer from '../features/studentEvaluations/studentEvaluationsSlice';
import trainersReducer from '../features/trainers/trainersSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    formations: formationsReducer,
    enrollments: enrollmentsReducer,
    evaluations: evaluationsReducer,
    studentEvaluations: studentEvaluationsReducer,
    trainers: trainersReducer,
    users: usersReducer,
  },
});

export default store; 