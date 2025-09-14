'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6', // Purple accent
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald green
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4', // Cyan
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#0f1419', // Rich dark background
      paper: '#1a202c', // Elevated surfaces
    },
    text: {
      primary: '#f7fafc', // Almost white
      secondary: '#a0aec0', // Muted text
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    action: {
      hover: 'rgba(99, 102, 241, 0.08)',
      selected: 'rgba(99, 102, 241, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5856eb 0%, #8b5cf6 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(26, 32, 44, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(26, 32, 44, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 20, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.8rem',
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
          color: '#ffffff',
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          color: '#ffffff',
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(26, 32, 44, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '8px 0',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 16,
          background: 'rgba(26, 32, 44, 0.8)',
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(255, 255, 255, 0.06)',
          },
          '& .MuiDataGrid-columnHeaders': {
            background: 'rgba(99, 102, 241, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.06)',
          },
        },
      },
    },
  },
});

export default theme;