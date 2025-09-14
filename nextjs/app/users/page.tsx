'use client';

import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Home, People } from '@mui/icons-material';
import UserTable from '../components/UserTable';

export default function UsersPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3, color: 'text.secondary' }}>
          <Link
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <Home fontSize="small" />
            Home
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
            <People fontSize="small" />
            Users
          </Box>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #00bcd4 0%, #ff6b6b 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            User Database
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Demonstrating Full-Stack Integration with Next.js, FastAPI, and SQLite
          </Typography>
        </Box>

        {/* User Table */}
        <UserTable />
      </Container>
    </Box>
  );
}