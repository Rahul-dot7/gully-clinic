import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from '../healthcare/src/components/Navbar';
import Sidebar from '../healthcare/src/components/Sidebar';
import Login from '../healthcare/src/pages/Login';
import Register from '../healthcare/src/pages/Register';
import Home from '../healthcare/src/pages/Home';

const drawerWidth = 240;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} drawerWidth={drawerWidth} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginTop: '64px',
            marginLeft: sidebarOpen ? `${drawerWidth}px` : 0,
            transition: 'margin 0.2s ease-in-out'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App; 