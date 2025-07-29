import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Button,
  Avatar
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AccountCircle as ProfileIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, drawerWidth }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Debug log to check user data
  console.log('Sidebar user data:', user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        position: 'relative',
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px',
          backgroundColor: '#283593',
          color: '#fff',
          position: 'fixed',
          height: 'calc(100vh - 64px)',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
          '& .MuiDivider-root': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
            margin: '16px 0'
          },
          '& .MuiListItem-root': {
            padding: '12px 16px',
            marginBottom: '4px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)'
            }
          },
          '& .MuiListItemIcon-root': {
            color: '#fff',
            minWidth: '40px'
          },
          '& .MuiTypography-root': {
            color: '#fff'
          },
          '& .MuiButton-root': {
            color: '#fff',
            borderColor: '#fff',
            padding: '10px 16px',
            marginTop: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderColor: '#fff'
            }
          }
        }
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        {/* QR Code Section */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Scan to Visit
          </Typography>
          <QRCodeSVG
            value="http://localhost:3000"
            size={180}
            level="H"
            includeMargin={true}
            style={{ 
              margin: '16px auto',
              maxWidth: '100%',
              height: 'auto',
              backgroundColor: 'white',
              padding: '8px',
              borderRadius: '8px'
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Scan with your mobile device
          </Typography>
        </Box>
        <Divider />

        {/* User Section */}
        {user ? (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2, bgcolor: '#1a237e', width: 56, height: 56 }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{user.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* User Number Display */}
            <Box sx={{ 
              backgroundColor: '#1a237e',
              color: 'white',
              p: 2,
              borderRadius: 2,
              mb: 3,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
                Your ID
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', letterSpacing: 0.5, fontSize: '0.9rem' }}>
                {user.userNumber || 'Not Available'}
              </Typography>
            </Box>
            
            {/* Navigation Buttons */}
            <List>
              <ListItem button onClick={() => navigate('/profile')} sx={{ mb: 1 }}>
                <ListItemIcon>
                  <ProfileIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText primary="View Profile" primaryTypographyProps={{ fontWeight: 'medium' }} />
              </ListItem>
              <ListItem button onClick={() => navigate('/chat')} sx={{ mb: 1 }}>
                <ListItemIcon>
                  <ChatIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText primary="Chat" primaryTypographyProps={{ fontWeight: 'medium' }} />
              </ListItem>
            </List>
            
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ mt: 2, py: 1.5 }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2, fontWeight: 'medium' }}>
              Welcome to Healthcare Access
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, opacity: 0.8 }}>
              Please login or register to access all features
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{ mb: 2, py: 1.5 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<RegisterIcon />}
              onClick={() => navigate('/register')}
              sx={{ py: 1.5, backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d47a1' } }}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;