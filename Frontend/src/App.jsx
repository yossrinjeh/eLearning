import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './app/store';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import RoomsList from './pages/rooms/RoomsList';
import FormationsList from './pages/formations/FormationsList';
import EnrollmentsList from './pages/enrollments/EnrollmentsList';
import EvaluationsList from './pages/evaluations/EvaluationsList';
import StudentEvaluationsList from './pages/studentEvaluations/StudentEvaluationsList';
import TrainersList from './pages/trainers/TrainersList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <RoomsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/formations"
              element={
                <ProtectedRoute>
                  <FormationsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrollments"
              element={
                <ProtectedRoute>
                  <EnrollmentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluations"
              element={
                <ProtectedRoute>
                  <EvaluationsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-evaluations"
              element={
                <ProtectedRoute>
                  <StudentEvaluationsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers"
              element={
                <ProtectedRoute>
                  <TrainersList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
