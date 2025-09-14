'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Paper,
  Chip,
  Stack,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  ApiOutlined,
  Launch,
  Code,
  Description,
  PlayArrow,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tabpanel-${index}`}
      aria-labelledby={`api-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ApiDocsPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/users',
      description: 'Retrieve all users with pagination, search, and filtering',
      parameters: [
        { name: 'page', type: 'integer', description: 'Page number (default: 1)' },
        { name: 'per_page', type: 'integer', description: 'Items per page (default: 10, max: 100)' },
        { name: 'search', type: 'string', description: 'Search by name or email' },
        { name: 'role', type: 'string', description: 'Filter by role (admin, manager, user)' },
      ],
      response: `{
  "users": [...],
  "total": 8,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}`,
    },
    {
      method: 'GET',
      path: '/api/users/{id}',
      description: 'Retrieve a specific user by ID',
      parameters: [
        { name: 'id', type: 'integer', description: 'User ID' },
      ],
      response: `{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "admin",
  "bio": "System administrator...",
  "created_at": "2023-01-01T00:00:00Z"
}`,
    },
    {
      method: 'POST',
      path: '/api/users',
      description: 'Create a new user',
      parameters: [],
      requestBody: `{
  "name": "New User",
  "email": "new@example.com",
  "role": "user",
  "bio": "Optional bio"
}`,
      response: `{
  "id": 9,
  "name": "New User",
  "email": "new@example.com",
  "role": "user",
  "bio": "Optional bio",
  "created_at": "2023-01-01T00:00:00Z"
}`,
    },
  ];

  const methodColors = {
    GET: 'success',
    POST: 'primary',
    PUT: 'warning',
    DELETE: 'error',
  } as const;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            API Documentation
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            FastAPI Backend Service Documentation
          </Typography>

          {/* Quick Links */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<Launch />}
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                },
              }}
            >
              Interactive API Docs
            </Button>
            <Button
              variant="outlined"
              startIcon={<Description />}
              href="http://localhost:8000/redoc"
              target="_blank"
              rel="noopener noreferrer"
            >
              ReDoc Documentation
            </Button>
            <Button
              variant="outlined"
              startIcon={<Code />}
              href="http://localhost:8000/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAPI Schema
            </Button>
          </Stack>
        </Box>

        {/* API Status */}
        <Alert severity="success" sx={{ mb: 4 }}>
          <AlertTitle>API Status: Online</AlertTitle>
          Backend service is running at <strong>http://localhost:8000</strong>
        </Alert>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="API documentation tabs">
              <Tab label="Endpoints" icon={<ApiOutlined />} />
              <Tab label="Live Demo" icon={<PlayArrow />} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            {/* API Endpoints */}
            <Typography variant="h5" gutterBottom>
              Available Endpoints
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The Users API provides CRUD operations with advanced features like pagination, search, and filtering.
            </Typography>

            <Stack spacing={3}>
              {apiEndpoints.map((endpoint, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={endpoint.method} 
                        color={methodColors[endpoint.method as keyof typeof methodColors]} 
                        sx={{ mr: 2, minWidth: 60 }}
                      />
                      <Typography 
                        variant="h6" 
                        component="code" 
                        sx={{ 
                          fontFamily: 'monospace', 
                          bgcolor: 'action.hover', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1 
                        }}
                      >
                        {endpoint.path}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {endpoint.description}
                    </Typography>

                    {endpoint.parameters.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Parameters:
                        </Typography>
                        <Stack spacing={1}>
                          {endpoint.parameters.map((param, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                              <Chip label={param.name} size="small" variant="outlined" />
                              <Chip label={param.type} size="small" color="secondary" />
                              <Typography variant="body2" color="text.secondary">
                                {param.description}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {endpoint.requestBody && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Request Body:
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                          <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {endpoint.requestBody}
                          </Typography>
                        </Paper>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Response Example:
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                        <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {endpoint.response}
                        </Typography>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </TabPanel>

          <TabPanel value={value} index={1}>
            {/* Live Demo */}
            <Typography variant="h5" gutterBottom>
              Live API Demo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try out the API endpoints directly in your browser or use these examples with curl.
            </Typography>

            <Stack spacing={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Get All Users
                  </Typography>
                  <Button
                    variant="contained"
                    href="http://localhost:8000/api/users"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 2 }}
                  >
                    Try GET /api/users
                  </Button>
                  <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {`curl -X GET "http://localhost:8000/api/users" \\
     -H "accept: application/json"`}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Search Users
                  </Typography>
                  <Button
                    variant="contained"
                    href="http://localhost:8000/api/users?search=John"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 2 }}
                  >
                    Try GET /api/users?search=John
                  </Button>
                  <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {`curl -X GET "http://localhost:8000/api/users?search=John" \\
     -H "accept: application/json"`}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Filter by Role
                  </Typography>
                  <Button
                    variant="contained"
                    href="http://localhost:8000/api/users?role=admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 2 }}
                  >
                    Try GET /api/users?role=admin
                  </Button>
                  <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {`curl -X GET "http://localhost:8000/api/users?role=admin" \\
     -H "accept: application/json"`}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Stack>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}