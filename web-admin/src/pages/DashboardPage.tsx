import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { analyticsService } from '../services/api/analyticsService';

export default function DashboardPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: () => analyticsService.getAdminAnalytics(),
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Total Users
            </Typography>
            <Typography variant="h4">{analytics?.totalUsers || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Active Users (30 days)
            </Typography>
            <Typography variant="h4">{analytics?.activeUsers || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Questions Answered
            </Typography>
            <Typography variant="h4">
              {analytics?.totalQuestionsAnswered || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}



