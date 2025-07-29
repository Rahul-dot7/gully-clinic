import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';

const FamilyMemberForm = ({ numberOfMembers, setNumberOfMembers, familyMembers, setFamilyMembers, onSubmit }) => {
  const [currentMember, setCurrentMember] = useState(1);
  const [memberData, setMemberData] = useState({
    name: '',
    aadhaarNumber: '',
    bloodGroup: '',
    allergies: '',
    conditions: '',
    relation: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'aadhaarNumber', 'bloodGroup', 'relation'];
    const missingFields = requiredFields.filter(field => !memberData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Add the current member to the family members array
      const newFamilyMembers = [...familyMembers, memberData];
      setFamilyMembers(newFamilyMembers);

      // If this is the last member, submit all data
      if (currentMember === numberOfMembers) {
        console.log('Submitting all data:', {
          mainUser: JSON.parse(localStorage.getItem('registrationData')),
          familyMembers: newFamilyMembers
        });
        await onSubmit(memberData);
      } else {
        // Reset form for next member
        setMemberData({
          name: '',
          aadhaarNumber: '',
          bloodGroup: '',
          allergies: '',
          conditions: '',
          relation: ''
        });
        setCurrentMember(prev => prev + 1);
        setError('');
      }
    } catch (error) {
      console.error('Error saving family member data:', error);
      setError(error.response?.data?.message || 'Error saving family member data');
    }
  };

  const handleNumberOfMembersChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setNumberOfMembers(value);
      setCurrentMember(1);
    }
  };

  if (!numberOfMembers) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Number of Family Members
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Enter number of family members"
          value={numberOfMembers || ''}
          onChange={handleNumberOfMembersChange}
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Family Member {currentMember} of {numberOfMembers}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="relation-label">Relation</InputLabel>
          <Select
            labelId="relation-label"
            id="relation"
            name="relation"
            value={memberData.relation}
            onChange={handleChange}
            label="Relation"
            input={<OutlinedInput label="Relation" />}
          >
            <MenuItem value="Spouse">Spouse</MenuItem>
            <MenuItem value="Child">Child</MenuItem>
            <MenuItem value="Parent">Parent</MenuItem>
            <MenuItem value="Sibling">Sibling</MenuItem>
            <MenuItem value="Grandparent">Grandparent</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          value={memberData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Aadhaar Number"
          name="aadhaarNumber"
          margin="normal"
          value={memberData.aadhaarNumber}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Blood Group"
          name="bloodGroup"
          margin="normal"
          value={memberData.bloodGroup}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Allergies (comma-separated)"
          name="allergies"
          margin="normal"
          value={memberData.allergies}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Conditions (comma-separated)"
          name="conditions"
          margin="normal"
          value={memberData.conditions}
          onChange={handleChange}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          {currentMember === numberOfMembers ? 'Complete Registration' : 'Next Member'}
        </Button>
      </form>
    </Box>
  );
};

export default FamilyMemberForm; 