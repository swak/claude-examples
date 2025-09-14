'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Chip,
  IconButton,
  Fade,
  Zoom,
  Card,
  CardContent,
} from '@mui/material';
import {
  RocketLaunch,
  Code,
  Speed,
  Security,
  Cloud,
  GitHub,
  LinkedIn,
  Twitter,
  CheckCircle,
  People,
  DataObject,
  SmartToy,
  Api,
  PlayArrow,
  TrendingUp,
} from '@mui/icons-material';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: 'Modern Stack',
      description: 'Built with Next.js 15 and Material-UI',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Blazing Fast',
      description: 'Optimized performance out of the box',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Type Safe',
      description: 'Full TypeScript support included',
    },
    {
      icon: <Cloud sx={{ fontSize: 40 }} />,
      title: 'Cloud Ready',
      description: 'Deploy anywhere with confidence',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)', // Account for navigation height
        background: 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 80%, #6366f1 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #06b6d4 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={8} sx={{ py: 8 }}>
          {/* Hero Section */}
          <Fade in={mounted} timeout={1000}>
            <Box textAlign="center" sx={{ mt: 8 }}>
              <Zoom in={mounted} timeout={1200}>
                <Box sx={{ mb: 3 }}>
                  <RocketLaunch 
                    sx={{ 
                      fontSize: 80, 
                      color: 'primary.main',
                      filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))'
                    }} 
                  />
                </Box>
              </Zoom>
              
              <Typography
                variant="h1"
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Swak's NextJS Application
              </Typography>
              
              <Typography
                variant="h3"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                is being started
              </Typography>

              <Paper
                elevation={10}
                sx={{
                  display: 'inline-block',
                  px: 4,
                  py: 2,
                  mb: 4,
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 3,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircle sx={{ color: 'success.main' }} />
                  <Typography variant="h5" sx={{ color: 'success.main' }}>
                    This works if you see it!
                  </Typography>
                </Stack>
              </Paper>

              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                <Chip label="Next.js 15" color="primary" />
                <Chip label="Material-UI" color="secondary" />
                <Chip label="TypeScript" color="info" />
                <Chip label="Claude Code" color="secondary" />
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Link href="/users" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<People />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                      },
                    }}
                  >
                    Users Demo
                  </Button>
                </Link>
                <Link href="/api-docs" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Api />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderColor: 'info.main',
                      color: 'info.main',
                      '&:hover': {
                        borderColor: 'info.light',
                        bgcolor: 'rgba(6, 182, 212, 0.1)',
                      },
                    }}
                  >
                    API Docs
                  </Button>
                </Link>
                <Link href="/agents" passHref style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<SmartToy />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                      '&:hover': {
                        borderColor: 'secondary.light',
                        bgcolor: 'rgba(139, 92, 246, 0.1)',
                      },
                    }}
                  >
                    AI Agents
                  </Button>
                </Link>
              </Stack>
            </Box>
          </Fade>

          {/* Features Grid */}
          <Fade in={mounted} timeout={1500}>
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Zoom in={mounted} timeout={1500 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        background: 'rgba(26, 31, 58, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0, 188, 212, 0.3)',
                          border: '1px solid rgba(0, 188, 212, 0.5)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Box sx={{ color: 'primary.main', mb: 2 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Fade>

          {/* Live Demo Features */}
          <Fade in={mounted} timeout={2000}>
            <Paper
              elevation={10}
              sx={{
                p: 4,
                background: 'rgba(26, 31, 58, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                mt: 6,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Live Demo Features
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                      },
                    }}
                    component={Link}
                    href="/users"
                    style={{ textDecoration: 'none' }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <People sx={{ fontSize: 48, color: '#6366f1', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        User Management System
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Complete CRUD operations with search, filtering, and pagination
                      </Typography>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Chip label="FastAPI" size="small" color="primary" />
                        <Chip label="SQLite" size="small" color="primary" />
                        <Chip label="MUI Table" size="small" color="primary" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)',
                      },
                    }}
                    component={Link}
                    href="/api-docs"
                    style={{ textDecoration: 'none' }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Api sx={{ fontSize: 48, color: '#06b6d4', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Interactive API Documentation
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Live API testing with Swagger UI and ReDoc integration
                      </Typography>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Chip label="OpenAPI" size="small" color="info" />
                        <Chip label="Live Testing" size="small" color="info" />
                        <Chip label="Curl Examples" size="small" color="info" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
                      },
                    }}
                    component={Link}
                    href="/agents"
                    style={{ textDecoration: 'none' }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <SmartToy sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        AI Development Agents
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Three specialized agents collaborating on full-stack development
                      </Typography>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Chip label="Frontend" size="small" color="success" />
                        <Chip label="Backend" size="small" color="success" />
                        <Chip label="Testing" size="small" color="success" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Quick Stats */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Development Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#6366f1', fontWeight: 'bold' }}>
                        8
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sample Users
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#06b6d4', fontWeight: 'bold' }}>
                        5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        API Endpoints
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                        3
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        AI Agents
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                        100%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Claude Code
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Fade>

          {/* Footer */}
          <Fade in={mounted} timeout={2000}>
            <Box sx={{ textAlign: 'center', mt: 8, pb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Powered by Claude Code & Next.js
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton color="primary" size="large">
                  <GitHub />
                </IconButton>
                <IconButton color="primary" size="large">
                  <LinkedIn />
                </IconButton>
                <IconButton color="primary" size="large">
                  <Twitter />
                </IconButton>
              </Stack>
            </Box>
          </Fade>
        </Stack>
      </Container>
    </Box>
  );
}