'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Home,
  People,
  Code,
  Security,
  ApiOutlined,
  MenuOutlined,
  GitHub,
  SmartToy,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: 'Home', href: '/', icon: <Home /> },
    { label: 'Users Demo', href: '/users', icon: <People /> },
    { label: 'API Docs', href: '/api-docs', icon: <ApiOutlined /> },
    { label: 'Agents', href: '/agents', icon: <SmartToy /> },
  ];

  const NavButton: React.FC<{ item: typeof navItems[0]; mobile?: boolean }> = ({ item, mobile = false }) => (
    <Link href={item.href} style={{ textDecoration: 'none' }} onClick={mobile ? handleClose : undefined}>
      <Button
        startIcon={item.icon}
        sx={{
          color: pathname === item.href ? 'primary.main' : 'text.primary',
          bgcolor: pathname === item.href ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
          borderRadius: 2,
          px: 2,
          py: 1,
          mx: 0.5,
          textTransform: 'none',
          fontWeight: pathname === item.href ? 600 : 400,
          '&:hover': {
            bgcolor: 'rgba(99, 102, 241, 0.1)',
          },
          ...(mobile && {
            justifyContent: 'flex-start',
            width: '100%',
            mx: 0,
          }),
        }}
      >
        {item.label}
      </Button>
    </Link>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(15, 20, 25, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Code 
                sx={{ 
                  fontSize: 32, 
                  color: 'primary.main', 
                  mr: 1,
                  filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Claude Examples
              </Typography>
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {navItems.map((item) => (
                <NavButton key={item.label} item={item} />
              ))}
              
              <Box sx={{ flexGrow: 1 }} />
              
              {/* Status Chips */}
              <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                <Chip 
                  label="Frontend: Online" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
                <Chip 
                  label="API: Online" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
              </Box>

              {/* GitHub Link */}
              <IconButton
                component="a"
                href="https://github.com/swak/claude-examples"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'text.secondary' }}
              >
                <GitHub />
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <Chip 
                label="Online" 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuOutlined />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    background: 'rgba(26, 32, 44, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.label} sx={{ p: 0 }}>
                    <NavButton item={item} mobile />
                  </MenuItem>
                ))}
                <MenuItem sx={{ p: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)', mt: 1 }}>
                  <IconButton
                    component="a"
                    href="https://github.com/swak/claude-examples"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'text.secondary' }}
                  >
                    <GitHub />
                  </IconButton>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    View Source
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;