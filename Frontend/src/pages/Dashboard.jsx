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

// Move CustomBarChart outside of any dashboard component
const CustomBarChart = ({ data }) => {
  const theme = useTheme();
  return (
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
};

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('Current user role:', user?.role);
    dispatch(fetchDashboardData(user?.role));
  }, [dispatch, user?.role]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  console.log('Dashboard Data:', dashboardData);

  if (user?.role === 'admin') {
    const summaryCards = [
      {
        title: 'Total Students',
        value: dashboardData?.total_users?.students || 0,
        color: '#2196F3',
        bgColor: alpha('#2196F3', 0.1)
      },
      {
        title: 'Total Trainers',
        value: dashboardData?.total_users?.trainers || 0,
        color: '#9C27B0',
        bgColor: alpha('#9C27B0', 0.1)
      },
      {
        title: 'Total Formations',
        value: dashboardData?.formations?.total || 0,
        color: '#4CAF50',
        bgColor: alpha('#4CAF50', 0.1)
      },
      {
        title: 'Total Enrollments',
        value: dashboardData?.enrollments?.total || 0,
        color: '#2196F3',
        bgColor: alpha('#2196F3', 0.1)
      }
    ];

    const formationsData = [
      { name: 'Active', value: dashboardData?.formations?.active || 0, color: '#4CAF50' },
      { name: 'Upcoming', value: dashboardData?.formations?.upcoming || 0, color: '#2196F3' },
      { name: 'Completed', value: dashboardData?.formations?.completed || 0, color: '#9C27B0' }
    ];

    const enrollmentsData = [
      { name: 'Completed', value: dashboardData?.enrollments?.accepted || 0, color: '#2196F3' },
      { name: 'Pending', value: dashboardData?.enrollments?.pending || 0, color: '#9C27B0' }
    ];

    return (
      <DashboardLayout>
        <Box p={3}>
          <Grid container spacing={3} mb={3}>
            {summaryCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
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

          <Grid container spacing={3}>
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
                        innerRadius={80}
                        outerRadius={120}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {enrollmentsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                      <Legend
                        align="right"
                        verticalAlign="middle"
                        layout="vertical"
                        iconType="circle"
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
  }

  if (user?.role === 'trainer') {
    return <TrainerDashboard data={dashboardData} />;
  }

  if (user?.role === 'student') {
    return <StudentDashboard data={dashboardData} />;
  }

  return null;
};

// Trainer Dashboard Component
const TrainerDashboard = ({ data: dashboardData }) => {
  const theme = useTheme();
  
  const summaryCards = [
    {
      title: 'Total Formations',
      value: dashboardData?.formations?.total || 0,
      color: '#4CAF50',
      bgColor: alpha('#4CAF50', 0.1)
    },
    {
      title: 'Total Students',
      value: dashboardData?.students?.total || 0,
      color: '#2196F3',
      bgColor: alpha('#2196F3', 0.1)
    },
    {
      title: 'Total Evaluations',
      value: dashboardData?.evaluations?.total || 0,
      color: '#9C27B0',
      bgColor: alpha('#9C27B0', 0.1)
    }
  ];

  const formationsData = [
    { name: 'Active', value: dashboardData?.formations?.active || 0, color: '#4CAF50' },
    { name: 'Upcoming', value: dashboardData?.formations?.upcoming || 0, color: '#2196F3' }
  ];

  const studentsData = [
    { name: 'Active', value: dashboardData?.students?.active || 0, color: '#2196F3' },
    { name: 'Inactive', value: (dashboardData?.students?.total || 0) - (dashboardData?.students?.active || 0), color: '#9C27B0' }
  ];

  return (
    <DashboardLayout>
      <Box p={3}>
        {/* Summary Cards */}
        <Grid container spacing={3} mb={3}>
          {summaryCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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

          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: theme.shadows[2], height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Students Status
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={studentsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {studentsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Legend
                      align="right"
                      verticalAlign="middle"
                      layout="vertical"
                      iconType="circle"
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

// Student Dashboard Component
const StudentDashboard = ({ data: dashboardData }) => {
  const theme = useTheme();
  
  const summaryCards = [
    {
      title: 'Total Enrollments',
      value: dashboardData?.enrollments?.total || 0,
      color: '#4CAF50',
      bgColor: alpha('#4CAF50', 0.1)
    },
    {
      title: 'Average Score',
      value: `${Number(dashboardData?.evaluations?.average_score || 0).toFixed(2)}%`,
      color: '#2196F3',
      bgColor: alpha('#2196F3', 0.1)
    },
    {
      title: 'Total Evaluations',
      value: dashboardData?.evaluations?.total || 0,
      color: '#9C27B0',
      bgColor: alpha('#9C27B0', 0.1)
    }
  ];

  const enrollmentsData = [
    { name: 'Active', value: dashboardData?.enrollments?.active || 0, color: '#2196F3' },
    { name: 'Completed', value: dashboardData?.enrollments?.completed || 0, color: '#4CAF50' }
  ];

  return (
    <DashboardLayout>
      <Box p={3}>
        {/* Summary Cards */}
        <Grid container spacing={3} mb={3}>
          {summaryCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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

        {/* Chart */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: theme.shadows[2] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Enrollments Status
                </Typography>
                <CustomBarChart data={enrollmentsData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;