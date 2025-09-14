'use client';

import React from 'react';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stack,
  Card,
  CardContent,
} from '@mui/material';

interface LoadingSkeletonProps {
  rows?: number;
  type?: 'table' | 'card' | 'list';
}

const TableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <TableContainer component={Paper} variant="outlined">
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><Skeleton variant="text" width="100%" /></TableCell>
          <TableCell><Skeleton variant="text" width="100%" /></TableCell>
          <TableCell><Skeleton variant="text" width="80px" /></TableCell>
          <TableCell><Skeleton variant="text" width="120px" /></TableCell>
          <TableCell><Skeleton variant="text" width="100px" /></TableCell>
          <TableCell><Skeleton variant="text" width="100px" /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="120px" />
              </Box>
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="180px" />
            </TableCell>
            <TableCell>
              <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="150px" />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="90px" />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const CardSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <Stack spacing={2}>
    {Array.from({ length: rows }).map((_, index) => (
      <Card key={index}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Box>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Stack>
);

const ListSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <Stack spacing={1}>
    {Array.from({ length: rows }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Skeleton variant="circular" width={32} height={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="50%" />
        </Box>
        <Skeleton variant="text" width="80px" />
      </Box>
    ))}
  </Stack>
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  rows = 5, 
  type = 'table' 
}) => {
  switch (type) {
    case 'card':
      return <CardSkeleton rows={rows} />;
    case 'list':
      return <ListSkeleton rows={rows} />;
    case 'table':
    default:
      return <TableSkeleton rows={rows} />;
  }
};

export default LoadingSkeleton;