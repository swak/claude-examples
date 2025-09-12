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
} from '@mui/icons-material';

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
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
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
            radial-gradient(circle at 20% 80%, #00bcd4 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #ff6b6b 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #00bcd4 0%, transparent 50%)
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
                      filter: 'drop-shadow(0 0 20px rgba(0, 188, 212, 0.5))'
                    }} 
                  />
                </Box>
              </Zoom>
              
              <Typography
                variant="h1"
                sx={{
                  background: 'linear-gradient(135deg, #00bcd4 0%, #ff6b6b 100%)',
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
                  background: 'rgba(0, 188, 212, 0.1)',
                  border: '1px solid rgba(0, 188, 212, 0.3)',
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
                <Chip label="TypeScript" sx={{ bgcolor: '#3178c6', color: 'white' }} />
                <Chip label="Claude Code" sx={{ bgcolor: '#ff6b6b', color: 'white' }} />
              </Stack>

              <Stack direction="row" spacing={3} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Code />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #00bcd4 0%, #008ba3 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5ddef4 0%, #00bcd4 100%)',
                    },
                  }}
                >
                  View Code
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.light',
                      bgcolor: 'rgba(0, 188, 212, 0.1)',
                    },
                  }}
                >
                  Learn More
                </Button>
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