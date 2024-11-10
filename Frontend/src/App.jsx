import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './app/store';
import ProtectedRoute from './components/ProtectedRoute';
import { GlobalStyles } from '@mui/material';

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
import StudentFormationsList from './pages/student/StudentFormationsList';
import StudentEvaluationView from './pages/student/StudentEvaluationView';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#10b981',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          color: '#ffffff',
        },
      },
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles 
          styles={{
            '#root': {
              minHeight: '100vh',
              width: '100%',
            }
          }} 
        />
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
                <ProtectedRoute roles={['admin']}>
                  <RoomsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/formations"
              element={
                <ProtectedRoute>
                  {({ user }) => (
                    user?.role === 'student' ? <StudentFormationsList /> : <FormationsList />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrollments"
              element={
                <ProtectedRoute roles={['admin']}>
                  <EnrollmentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluations"
              element={
                <ProtectedRoute roles={['admin', 'trainer']}>
                  {({ user }) => (
                    user?.role === 'student' ? <StudentEvaluationView /> : <EvaluationsList />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-evaluations"
              element={
                <ProtectedRoute roles={['admin', 'trainer']}>
                  <StudentEvaluationsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers"
              element={
                <ProtectedRoute roles={['admin']}>
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
