import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ConsultationCenters from './pages/ConsultationCenters';
import SpecialistDoctors from './pages/SpecialistDoctors';
import GovernmentSchemes from './pages/GovernmentSchemes';
import Pharmacies from './pages/Pharmacies';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Profile from './pages/Profile';
import Chat from './components/Chat';

const drawerWidth = 280;

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Box sx={{ 
              display: 'flex',
              minHeight: '100vh',
              backgroundColor: '#f5f5f5'
            }}>
              <CssBaseline />
              <Navbar toggleSidebar={toggleSidebar} />
              <Sidebar isOpen={sidebarOpen} drawerWidth={drawerWidth} />
              
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
                  marginTop: '64px',
                  marginLeft: sidebarOpen ? `${drawerWidth}px` : 0,
                  transition: 'margin 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Container 
                  maxWidth="lg" 
                  sx={{ 
                    mt: 4,
                    mb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  <Box sx={{ width: '100%', maxWidth: '1000px' }}>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/profile" element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } />
                      <Route path="/chat" element={
                        <PrivateRoute>
                          <Chat />
                        </PrivateRoute>
                      } />
                      <Route path="/" element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      <Route path="/consultation-centers" element={<ConsultationCenters />} />
                      <Route path="/specialist-doctors" element={<SpecialistDoctors />} />
                      <Route path="/government-schemes" element={<GovernmentSchemes />} />
                      <Route path="/pharmacies" element={<Pharmacies />} />
                    </Routes>
                  </Box>
                </Container>
              </Box>
            </Box>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App; 