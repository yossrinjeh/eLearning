import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  CircularProgress,
  alpha
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  // Summary Cards Data
  const summaryCards = [
    {
      title: 'Total Students',
      value: dashboardData?.total_users?.students || 0,
      color: '#2196F3',  // Blue
      bgColor: alpha('#2196F3', 0.1)
    },
    {
      title: 'Total Trainers',
      value: dashboardData?.total_users?.trainers || 0,
      color: '#9C27B0',  // Purple
      bgColor: alpha('#9C27B0', 0.1)
    },
    {
      title: 'Total Formations',
      value: dashboardData?.formations?.total || 0,
      color: '#4CAF50',  // Green
      bgColor: alpha('#4CAF50', 0.1)
    },
    {
      title: 'Total Enrollments',
      value: dashboardData?.enrollments?.total || 0,
      color: '#2196F3',  // Blue
      bgColor: alpha('#2196F3', 0.1)
    }
  ];

  // Formation status colors
  const formationStatusColors = {
    active: '#4CAF50',     // Green
    upcoming: '#2196F3',   // Blue
    completed: '#9C27B0'   // Purple
  };

  // Enrollment status colors
  const enrollmentStatusColors = {
    accepted: '#2196F3',   // Blue
    pending: '#9C27B0'     // Purple
  };

  // Chart Data with colors
  const formationsData = [
    { name: 'Active', value: dashboardData?.formations?.active || 0, color: '#4CAF50' },
    { name: 'Upcoming', value: dashboardData?.formations?.upcoming || 0, color: '#2196F3' },
    { name: 'Completed', value: dashboardData?.formations?.completed || 0, color: '#9C27B0' }
  ];

  const enrollmentsData = [
    { name: 'Accepted', value: dashboardData?.enrollments?.accepted || 0, color: enrollmentStatusColors.accepted },
    { name: 'Pending', value: dashboardData?.enrollments?.pending || 0, color: enrollmentStatusColors.pending }
  ];

  const CustomBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card sx={{ p: 1.5, boxShadow: theme.shadows[3] }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {label}
                  </Typography>
                  <Typography variant="h6" color={payload[0].payload.color}>
                    {payload[0].value}
                  </Typography>
                </Card>
              );
            }
            return null;
          }}
        />
        <Bar 
          dataKey="value"
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <DashboardLayout>
      <Box p={3}>
        {/* Summary Cards */}
        <Grid container spacing={3} mb={3}>
          {summaryCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  bgcolor: card.bgColor,
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    color={card.color}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Formations Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: theme.shadows[2], height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Formations Status
                </Typography>
                <CustomBarChart data={formationsData} />
              </CardContent>
            </Card>
          </Grid>

          {/* Enrollments Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: theme.shadows[2], height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Enrollments Status
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={enrollmentsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {enrollmentsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={theme.palette.background.paper}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <Card sx={{ p: 1.5, boxShadow: theme.shadows[3] }}>
                              <Typography variant="subtitle2" color="textSecondary">
                                {payload[0].name}
                              </Typography>
                              <Typography variant="h6" color={payload[0].payload.color}>
                                {payload[0].value}
                              </Typography>
                            </Card>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;