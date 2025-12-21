import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { knowledgeAreaService } from '../services/api/knowledgeAreaService';

export default function KnowledgeAreasPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['knowledgeAreas'],
    queryFn: () => knowledgeAreaService.getKnowledgeAreas(),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Knowledge Areas</Typography>
        <Alert severity="error">Failed to load knowledge areas. Please try again.</Alert>
      </Box>
    );
  }

  const knowledgeAreas = data?.knowledgeAreas || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Knowledge Areas</Typography>
      
      {knowledgeAreas.length === 0 ? (
        <Alert severity="info">No knowledge areas found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {knowledgeAreas.map((ka: any) => (
                <TableRow key={ka.id}>
                  <TableCell>{ka.order || ka.order || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {ka.name || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {ka.description || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

