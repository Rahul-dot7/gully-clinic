import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Healthcare Access Portal
      </Typography>
      <Typography variant="body1">
        This platform aims to improve access to healthcare and essential services for underprivileged people in slum areas.
      </Typography>
    </Box>
  );
};

export default Home; 