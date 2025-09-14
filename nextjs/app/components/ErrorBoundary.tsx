'use client';

import React, { Component, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack,
    });
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box sx={{ p: 3, minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent>
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugReport />
                  Something went wrong
                </AlertTitle>
                An unexpected error occurred while rendering this component.
              </Alert>

              <Stack spacing={2}>
                <Typography variant="h6" gutterBottom>
                  What happened?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The application encountered an error and couldn't recover. This might be due to:
                </Typography>
                <Box component="ul" sx={{ ml: 2, color: 'text.secondary' }}>
                  <Typography component="li" variant="body2">Network connectivity issues</Typography>
                  <Typography component="li" variant="body2">Invalid data from the API</Typography>
                  <Typography component="li" variant="body2">Browser compatibility issues</Typography>
                  <Typography component="li" variant="body2">Temporary server problems</Typography>
                </Box>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Error Details (Development Mode):
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: 'action.hover',
                        p: 2,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        overflow: 'auto',
                        maxHeight: 200,
                      }}
                    >
                      <Typography variant="body2" color="error">
                        {this.state.error.message}
                      </Typography>
                      {this.state.errorInfo && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {this.state.errorInfo}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={this.handleReload}
                  >
                    Reload Page
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;