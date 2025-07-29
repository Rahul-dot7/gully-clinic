import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Please log in to view your dashboard</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={user.email}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Aadhaar Number"
                  secondary={user.aadhaarNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Blood Group"
                  secondary={user.bloodGroup}
                />
              </ListItem>
              {user.allergies && user.allergies.length > 0 && (
                <ListItem>
                  <ListItemText
                    primary="Allergies"
                    secondary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {user.allergies.map((allergy, index) => (
                          <Chip key={index} label={allergy} color="error" variant="outlined" />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              )}
              {user.conditions && user.conditions.length > 0 && (
                <ListItem>
                  <ListItemText
                    primary="Medical Conditions"
                    secondary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {user.conditions.map((condition, index) => (
                          <Chip key={index} label={condition} color="warning" variant="outlined" />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Family Members */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Family Members
            </Typography>
            {user.familyMembers && user.familyMembers.length > 0 ? (
              <List>
                {user.familyMembers.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem>
                      <Card sx={{ width: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {member.name} ({member.relation})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aadhaar: {member.aadhaarNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Blood Group: {member.bloodGroup}
                          </Typography>
                          {member.allergies && member.allergies.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Allergies:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {member.allergies.map((allergy, idx) => (
                                  <Chip key={idx} label={allergy} size="small" color="error" variant="outlined" />
                                ))}
                              </Box>
                            </Box>
                          )}
                          {member.conditions && member.conditions.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Conditions:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                {member.conditions.map((condition, idx) => (
                                  <Chip key={idx} label={condition} size="small" color="warning" variant="outlined" />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </ListItem>
                    {index < user.familyMembers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No family members added yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 