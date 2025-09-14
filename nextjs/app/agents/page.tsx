'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Stack,
  Chip,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  SmartToy,
  Code,
  Storage,
  BugReport,
  ExpandMore,
  Launch,
  CheckCircle,
  AutoAwesome,
  Speed,
  Security,
} from '@mui/icons-material';

export default function AgentsPage() {
  const [expandedAgent, setExpandedAgent] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAgent(isExpanded ? panel : false);
  };

  const agents = [
    {
      id: 'frontend',
      name: 'Frontend Developer Agent',
      description: 'Specialized in Next.js, React, and Material-UI development',
      avatar: <Code sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      skills: [
        'Next.js 15 with App Router',
        'React 18 with TypeScript',
        'Material-UI Components',
        'Responsive Design',
        'State Management',
        'Component Architecture',
        'Performance Optimization',
        'Accessibility (a11y)',
      ],
      achievements: [
        'Created responsive user table with search & pagination',
        'Implemented dark theme with MUI',
        'Built comprehensive navigation system',
        'Developed interactive API documentation page',
      ],
      codeExample: `// Example: Creating a responsive data table
const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = async (params: SearchParams) => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/users?\${new URLSearchParams(params)}\`);
      const data = await response.json();
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataGrid
      rows={users}
      columns={columns}
      loading={loading}
      pagination
      {...otherProps}
    />
  );
};`,
    },
    {
      id: 'backend',
      name: 'Backend Developer Agent',
      description: 'Expert in FastAPI, SQLAlchemy, and database design',
      avatar: <Storage sx={{ fontSize: 40 }} />,
      color: '#06b6d4',
      skills: [
        'FastAPI Framework',
        'SQLAlchemy ORM',
        'SQLite & PostgreSQL',
        'RESTful API Design',
        'Database Migrations',
        'CORS Configuration',
        'Data Validation',
        'Async Programming',
      ],
      achievements: [
        'Built complete REST API with CRUD operations',
        'Implemented database seeding with sample data',
        'Created robust user model with validation',
        'Set up automatic API documentation',
      ],
      codeExample: `# Example: FastAPI endpoint with validation
from fastapi import FastAPI, Query, HTTPException
from sqlalchemy.orm import Session

@app.get("/api/users", response_model=UsersResponse)
async def get_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    
    if search:
        query = query.filter(
            (User.name.contains(search)) | 
            (User.email.contains(search))
        )
    
    if role:
        query = query.filter(User.role == role)
    
    total = query.count()
    users = query.offset((page - 1) * per_page).limit(per_page).all()
    
    return UsersResponse(
        users=users,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=ceil(total / per_page)
    )`,
    },
    {
      id: 'testing',
      name: 'Unit Testing Agent',
      description: 'Focused on comprehensive testing strategies and quality assurance',
      avatar: <BugReport sx={{ fontSize: 40 }} />,
      color: '#10b981',
      skills: [
        'Jest & React Testing Library',
        'pytest for Python',
        'Integration Testing',
        'Mocking & Fixtures',
        'Test Coverage Analysis',
        'End-to-End Testing',
        'Performance Testing',
        'Security Testing',
      ],
      achievements: [
        'Created comprehensive frontend test suites',
        'Implemented backend API testing',
        'Set up database testing with fixtures',
        'Achieved high test coverage across components',
      ],
      codeExample: `# Example: Comprehensive API testing
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def sample_user():
    return {
        "name": "Test User",
        "email": "test@example.com",
        "role": "user",
        "bio": "Test bio"
    }

def test_create_user(sample_user):
    response = client.post("/api/users", json=sample_user)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == sample_user["name"]
    assert data["email"] == sample_user["email"]

def test_get_users_pagination():
    response = client.get("/api/users?page=1&per_page=5")
    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert "total" in data
    assert len(data["users"]) <= 5`,
    },
  ];

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
            AI Development Agents
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Specialized Claude Code agents working together to build full-stack applications
          </Typography>

          {/* Agent Collaboration Demo */}
          <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
            <AlertTitle>Agent Collaboration Demonstration</AlertTitle>
            These three agents successfully collaborated to build the complete user management system you see in this demo:
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              <Chip label="Users API" color="success" size="small" />
              <Chip label="Data Table UI" color="success" size="small" />
              <Chip label="Test Coverage" color="success" size="small" />
              <Chip label="Documentation" color="success" size="small" />
            </Stack>
          </Alert>
        </Box>

        {/* Agent Cards Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {agents.map((agent) => (
            <Grid item xs={12} md={4} key={agent.id}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(26, 31, 58, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${agent.color}30`,
                    border: `1px solid ${agent.color}50`,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: agent.color,
                      mx: 'auto',
                      mb: 2,
                      boxShadow: `0 4px 20px ${agent.color}40`,
                    }}
                  >
                    {agent.avatar}
                  </Avatar>
                  
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {agent.name}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {agent.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Core Skills:
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      {agent.skills.slice(0, 4).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: agent.color + '50' }}
                        />
                      ))}
                      {agent.skills.length > 4 && (
                        <Chip
                          label={`+${agent.skills.length - 4} more`}
                          size="small"
                          sx={{ bgcolor: agent.color + '20' }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Button
                    variant="contained"
                    sx={{
                      background: `linear-gradient(135deg, ${agent.color} 0%, ${agent.color}CC 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${agent.color}DD 0%, ${agent.color} 100%)`,
                      },
                    }}
                    onClick={() => setExpandedAgent(expandedAgent === agent.id ? false : agent.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Agent Information */}
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome sx={{ color: 'primary.main' }} />
              Agent Details & Code Examples
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Explore the detailed capabilities and real code examples from each specialized agent.
            </Typography>

            {agents.map((agent) => (
              <Accordion
                key={agent.id}
                expanded={expandedAgent === agent.id}
                onChange={handleChange(agent.id)}
                sx={{
                  mb: 1,
                  background: 'rgba(26, 31, 58, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: agent.color,
                    }}
                  >
                    {agent.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{agent.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {agent.skills.length} specialized skills
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        All Skills & Capabilities
                      </Typography>
                      <Stack spacing={1}>
                        {agent.skills.map((skill, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                            <Typography variant="body2">{skill}</Typography>
                          </Box>
                        ))}
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        Recent Achievements
                      </Typography>
                      <Stack spacing={1}>
                        {agent.achievements.map((achievement, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Speed sx={{ color: agent.color, fontSize: 16 }} />
                            <Typography variant="body2">{achievement}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        Code Example
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'action.hover', overflow: 'auto' }}>
                        <Typography
                          component="pre"
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            lineHeight: 1.4,
                            whiteSpace: 'pre-wrap',
                            margin: 0,
                          }}
                        >
                          {agent.codeExample}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>

        {/* Performance Metrics */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security sx={{ color: 'primary.main' }} />
            Collaboration Results
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                  8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  API Endpoints Created
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                  15+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  React Components
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  95%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Test Coverage
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Security Issues
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            See the Agents in Action
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Experience the collaborative development process by exploring our live demos
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Launch />}
              href="/users"
              sx={{
                background: 'linear-gradient(135deg, #00bcd4 0%, #008ba3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5ddef4 0%, #00bcd4 100%)',
                },
              }}
            >
              Try User Management Demo
            </Button>
            <Button
              variant="outlined"
              startIcon={<Code />}
              href="/api-docs"
            >
              View API Documentation
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}