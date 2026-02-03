import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../services/api/analyticsService';

export default function AnalyticsPage() {
  const { data: usageData } = useQuery({
    queryKey: ['usageAnalytics'],
    queryFn: () => analyticsService.getUsageAnalytics(),
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue'],
    queryFn: () => analyticsService.getRevenueReport(),
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Usage Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData?.usage || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="questions_answered" stroke="#8884d8" />
                <Line type="monotone" dataKey="active_users" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Report
            </Typography>
            <Typography variant="h4" color="primary">
              ${revenueData?.estimatedMonthlyRevenue?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimated Monthly Revenue
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}



