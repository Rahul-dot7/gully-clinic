import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import FamilyMemberForm from '../components/FamilyMemberForm';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aadhaarNumber: '',
    bloodGroup: '',
    allergies: '',
    conditions: ''
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        aadhaarNumber: user.aadhaarNumber || '',
        bloodGroup: user.bloodGroup || '',
        allergies: Array.isArray(user.allergies) ? user.allergies.join(', ') : '',
        conditions: Array.isArray(user.conditions) ? user.conditions.join(', ') : ''
      });
      setFamilyMembers(user.familyMembers || []);
    }
  }, [user]);

  const handleEditClick = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      aadhaarNumber: user.aadhaarNumber || '',
      bloodGroup: user.bloodGroup || '',
      allergies: Array.isArray(user.allergies) ? user.allergies.join(', ') : '',
      conditions: Array.isArray(user.conditions) ? user.conditions.join(', ') : ''
    });
    setFamilyMembers(user.familyMembers || []);
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setError('');
    setSuccess('');
  };

  const validateAadhaarFormat = (aadhaar) => {
    const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'aadhaarNumber') {
      const cleaned = value.replace(/\D/g, '');
      const truncated = cleaned.slice(0, 12);
      let formatted = '';
      for (let i = 0; i < truncated.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += '-';
        }
        formatted += truncated[i];
      }
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!validateAadhaarFormat(formData.aadhaarNumber)) {
        setError('Please enter a valid Aadhaar number in format: XXXX-XXXX-XXXX');
        return;
      }

      const processedData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : [],
        conditions: formData.conditions ? formData.conditions.split(',').map(item => item.trim()) : []
      };

      const response = await axios.put(
        `http://localhost:5000/api/auth/update/${user.id}`,
        {
          ...processedData,
          familyMembers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Profile updated successfully');
        updateUser(response.data.user);
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Update error:', error);
      setError(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleFamilyMemberSubmit = (updatedFamilyMembers) => {
    setFamilyMembers(updatedFamilyMembers);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Please log in to view your profile</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section with ID */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
            {user.userNumber && (
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'medium',
                  backgroundColor: '#fff',
                  p: 1,
                  borderRadius: 1,
                  display: 'inline-block'
                }}
              >
                ID: {user.userNumber}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>

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
                  primary="Name"
                  secondary={user.name}
                />
              </ListItem>
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
              <ListItem>
                <ListItemText
                  primary="Location"
                  secondary={user.location}
                />
              </ListItem>
              {user.allergies && user.allergies.length > 0 && (
                <ListItem>
                  <ListItemText
                    primary="Allergies"
                    secondary={user.allergies.join(', ')}
                  />
                </ListItem>
              )}
              {user.conditions && user.conditions.length > 0 && (
                <ListItem>
                  <ListItemText
                    primary="Medical Conditions"
                    secondary={user.conditions.join(', ')}
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
                  <ListItem key={member.id || index} sx={{ display: 'block', mb: 2 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom component="div">
                          {member.name} ({member.relation})
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" component="div">
                            Aadhaar: {member.aadhaarNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" component="div">
                            Blood Group: {member.bloodGroup}
                          </Typography>
                          {member.allergies && member.allergies.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" component="div">
                                Allergies:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {member.allergies.map((allergy, idx) => (
                                  <Chip
                                    key={idx}
                                    label={allergy}
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                          {member.conditions && member.conditions.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" component="div">
                                Medical Conditions:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {member.conditions.map((condition, idx) => (
                                  <Chip
                                    key={idx}
                                    label={condition}
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
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

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Number"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  required
                  placeholder="XXXX-XXXX-XXXX"
                  helperText="Format: XXXX-XXXX-XXXX"
                  error={formData.aadhaarNumber && !validateAadhaarFormat(formData.aadhaarNumber)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    label="Blood Group"
                  >
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Allergies (comma-separated)"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  helperText="Enter allergies separated by commas"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Conditions (comma-separated)"
                  name="conditions"
                  value={formData.conditions}
                  onChange={handleChange}
                  helperText="Enter conditions separated by commas"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Family Members
              </Typography>
              <FamilyMemberForm
                initialFamilyMembers={familyMembers}
                onConfirm={handleFamilyMemberSubmit}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile; 