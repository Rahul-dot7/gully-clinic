import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FamilyMemberForm from '../components/FamilyMemberForm';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    aadhaarNumber: '',
    bloodGroup: '',
    allergies: '',
    conditions: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const familyFormRef = useRef();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAadhaarFormat = (aadhaar) => {
    const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'aadhaarNumber') {
      // Remove any non-digit characters
      const cleaned = value.replace(/\D/g, '');
      
      // Format as XXXX-XXXX-XXXX
      let formatted = '';
      if (cleaned.length > 0) {
        formatted = cleaned.match(/.{1,4}/g).join('-');
      }
      
      // Limit to 12 digits (4-4-4 format)
      formatted = formatted.substring(0, 14); // 12 digits + 2 hyphens
      
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    // Validate first step
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword ||
        !formData.location || !formData.aadhaarNumber || !formData.bloodGroup) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateAadhaarFormat(formData.aadhaarNumber)) {
      setError('Invalid Aadhaar number format');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleAddFamilyMember = (newFamilyMember) => {
    // Check for duplicate Aadhaar numbers
    const isDuplicate = familyMembers.some(
      member => member.aadhaarNumber === newFamilyMember.aadhaarNumber
    );

    if (isDuplicate) {
      setError('A family member with this Aadhaar number already exists');
      return;
    }

    // Append the new family member to the existing array
    setFamilyMembers([...familyMembers, newFamilyMember]);
    setError('');
    
    // Reset the family member form
    if (familyFormRef.current) {
      familyFormRef.current.resetForm();
    }
  };

  const handleRemoveFamilyMember = (index) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const locationMap = {
    'ADH': 'ANDHERI',
    'JOS': 'JOGESHWARI',
    'RMAR': 'RAM MANDIR',
    'GMN': 'GOREGAON'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Step 1: Log current form state
      console.log('Step 1 - Current Form Data:', {
        name: formData.name || '[empty]',
        email: formData.email || '[empty]',
        password: formData.password || '[empty]',
        aadhaarNumber: formData.aadhaarNumber || '[empty]',
        bloodGroup: formData.bloodGroup || '[empty]',
        location: formData.location || '[empty]',
        allergies: formData.allergies || '[empty]',
        conditions: formData.conditions || '[empty]'
      });

      // Step 2: Validate each required field individually
      if (!formData.name || formData.name.trim() === '') {
        setError('Name is required');
        return;
      }

      if (!formData.email || formData.email.trim() === '') {
        setError('Email is required');
        return;
      }

      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      if (!formData.password || formData.password.trim() === '') {
        setError('Password is required');
        return;
      }

      if (!formData.aadhaarNumber || formData.aadhaarNumber.trim() === '') {
        setError('Aadhaar number is required');
        return;
      }

      if (!validateAadhaarFormat(formData.aadhaarNumber)) {
        setError('Please enter a valid Aadhaar number in format: XXXX-XXXX-XXXX');
        return;
      }

      if (!formData.bloodGroup || formData.bloodGroup.trim() === '') {
        setError('Blood group is required');
        return;
      }

      if (!formData.location || formData.location.trim() === '') {
        setError('Location is required');
        return;
      }

      // Step 3: Map location code to full name
      const fullLocation = locationMap[formData.location];
      if (!fullLocation) {
        setError('Invalid location selected');
        console.error('Invalid location code:', formData.location);
        return;
      }

      // Step 4: Prepare data for submission
      const processedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        aadhaarNumber: formData.aadhaarNumber.trim(),
        bloodGroup: formData.bloodGroup,
        location: fullLocation,
        allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()).filter(Boolean) : [],
        conditions: formData.conditions ? formData.conditions.split(',').map(item => item.trim()).filter(Boolean) : [],
        familyMembers: familyMembers
      };

      // Step 5: Log the final data being sent
      console.log('Step 5 - Data being sent to server:', {
        ...processedData,
        password: '[HIDDEN]',
        familyMembers: familyMembers.map(fm => ({
          ...fm,
          name: fm.name || '[empty]',
          relation: fm.relation || '[empty]',
          aadhaarNumber: fm.aadhaarNumber || '[empty]',
          bloodGroup: fm.bloodGroup || '[empty]'
        }))
      });

      // Step 6: Make the API request
      const response = await axios.post('http://localhost:5000/api/auth/register', processedData);

      if (response.data.success) {
        setSuccess('Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      // Step 7: Enhanced error logging
      console.error('Registration error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        requestData: {
          name: formData.name || '[empty]',
          email: formData.email || '[empty]',
          aadhaarNumber: formData.aadhaarNumber || '[empty]',
          bloodGroup: formData.bloodGroup || '[empty]',
          location: formData.location || '[empty]'
        }
      });

      // Handle specific error cases
      if (error.response?.status === 400) {
        // Validation errors from the server
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          setError(error.response.data.errors.join('. '));
        } else {
          setError(error.response.data.message || 'Please check your input and try again.');
        }
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (!error.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.response.data.message || 'Registration failed. Please try again.');
      }
    }
  };

  // Add form state debug display during development
  console.log('Current form state:', formData);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 800 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Registration {step}/2
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {step === 1 ? (
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="aadhaarNumber"
              label="Aadhaar Number"
              id="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              placeholder="XXXX-XXXX-XXXX"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="bloodGroup-label">Blood Group</InputLabel>
              <Select
                labelId="bloodGroup-label"
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                label="Blood Group"
                onChange={handleChange}
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                id="location"
                name="location"
                value={formData.location}
                label="Location"
                onChange={handleChange}
              >
                <MenuItem value="ADH">Andheri (ADH)</MenuItem>
                <MenuItem value="JOS">Jogeshwari (JOS)</MenuItem>
                <MenuItem value="RMAR">Ram Mandir (RMAR)</MenuItem>
                <MenuItem value="GMN">Goregaon (GMN)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              name="allergies"
              label="Allergies (comma-separated)"
              id="allergies"
              value={formData.allergies}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              name="conditions"
              label="Medical Conditions (comma-separated)"
              id="conditions"
              value={formData.conditions}
              onChange={handleChange}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              sx={{ mt: 3, mb: 2 }}
            >
              Next
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Family Members
            </Typography>
            
            {familyMembers.length > 0 && (
              <List sx={{ mb: 2 }}>
                {familyMembers.map((member, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveFamilyMember(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={member.name}
                      secondary={`${member.relation} | ${member.bloodGroup} | ${member.aadhaarNumber}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <FamilyMemberForm
              ref={familyFormRef}
              onConfirm={handleAddFamilyMember}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ flex: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ flex: 1 }}
                disabled={familyMembers.length === 0}
              >
                Complete Registration
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Register; 