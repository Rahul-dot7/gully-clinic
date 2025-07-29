import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  Box,
  Paper
} from '@mui/material';

const AddFamilyMemberDialog = ({ open, onClose, onSubmit, isEmbedded = false }) => {
  const [member, setMember] = useState({
    name: '',
    relation: '',
    aadhaarNumber: '',
    bloodGroup: '',
    allergies: '',
    conditions: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setMember(prev => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }

    setMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setError('');
    
    // Validate required fields
    const requiredFields = ['name', 'relation', 'aadhaarNumber', 'bloodGroup'];
    const missingFields = requiredFields.filter(field => !member[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!validateAadhaarFormat(member.aadhaarNumber)) {
      setError('Please enter a valid Aadhaar number in format: XXXX-XXXX-XXXX');
      return;
    }

    // Process the member data
    const processedMember = {
      ...member,
      allergies: member.allergies ? member.allergies.split(',').map(item => item.trim()) : [],
      conditions: member.conditions ? member.conditions.split(',').map(item => item.trim()) : []
    };

    onSubmit(processedMember);
    
    // Show success message
    setSuccess(`${member.name} added successfully!`);
    
    // Reset form
    setMember({
      name: '',
      relation: '',
      aadhaarNumber: '',
      bloodGroup: '',
      allergies: '',
      conditions: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
  };

  const formContent = (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={member.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Relation</InputLabel>
            <Select
              name="relation"
              value={member.relation}
              onChange={handleChange}
              label="Relation"
            >
              <MenuItem value="Spouse">Spouse</MenuItem>
              <MenuItem value="Child">Child</MenuItem>
              <MenuItem value="Parent">Parent</MenuItem>
              <MenuItem value="Sibling">Sibling</MenuItem>
              <MenuItem value="Grandparent">Grandparent</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Aadhaar Number"
            name="aadhaarNumber"
            value={member.aadhaarNumber}
            onChange={handleChange}
            required
            placeholder="XXXX-XXXX-XXXX"
            helperText="Format: XXXX-XXXX-XXXX"
            error={member.aadhaarNumber && !validateAadhaarFormat(member.aadhaarNumber)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Blood Group</InputLabel>
            <Select
              name="bloodGroup"
              value={member.bloodGroup}
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
            label="Allergies"
            name="allergies"
            value={member.allergies}
            onChange={handleChange}
            helperText="Enter allergies separated by commas"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Medical Conditions"
            name="conditions"
            value={member.conditions}
            onChange={handleChange}
            helperText="Enter conditions separated by commas"
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        {!isEmbedded && <Button onClick={onClose}>Cancel</Button>}
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ ml: 1 }}>
          Add Family Member
        </Button>
      </Box>
    </>
  );

  if (isEmbedded) {
    return (
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
        {formContent}
      </Paper>
    );
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Family Member</DialogTitle>
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={success}
      />
    </>
  );
};

export default AddFamilyMemberDialog; 