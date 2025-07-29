import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Grid, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get(`/api/family-members/${user._id}`);
        setFamilyMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch family members');
        setLoading(false);
      }
    };

    if (user) {
      fetchFamilyMembers();
    }
  }, [user]);

  if (loading) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ mt: 4 }}>{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Information
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Personal Details</Typography>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Aadhaar Number:</strong> {user.aadhaarNumber}</Typography>
              <Typography><strong>Blood Group:</strong> {user.bloodGroup}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Health Information</Typography>
              <Typography><strong>Allergies:</strong> {user.allergies?.join(', ') || 'None'}</Typography>
              <Typography><strong>Conditions:</strong> {user.conditions?.join(', ') || 'None'}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Family Members
        </Typography>
        
        {familyMembers.length > 0 ? (
          familyMembers.map((member) => (
            <Paper key={member._id} elevation={2} sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>{member.name}</Typography>
                  <Typography><strong>Relationship:</strong> {member.relationship}</Typography>
                  <Typography><strong>Aadhaar Number:</strong> {member.aadhaarNumber}</Typography>
                  <Typography><strong>Blood Group:</strong> {member.bloodGroup}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Health Information</Typography>
                  <Typography><strong>Allergies:</strong> {member.allergies?.join(', ') || 'None'}</Typography>
                  <Typography><strong>Conditions:</strong> {member.conditions?.join(', ') || 'None'}</Typography>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>No family members added yet.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile; 