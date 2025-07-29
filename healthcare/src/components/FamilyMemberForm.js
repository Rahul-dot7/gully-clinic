import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

const FamilyMemberForm = forwardRef(({ initialFamilyMembers = [], onConfirm }, ref) => {
  const [familyMembers, setFamilyMembers] = useState(initialFamilyMembers);
  const [currentMember, setCurrentMember] = useState({
    name: '',
    relation: '',
    aadhaarNumber: '',
    bloodGroup: '',
    allergies: '',
    conditions: ''
  });
  const [error, setError] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    if (initialFamilyMembers && JSON.stringify(initialFamilyMembers) !== JSON.stringify(familyMembers)) {
      setFamilyMembers(initialFamilyMembers);
    }
  }, [initialFamilyMembers]);

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
      
      setCurrentMember({ ...currentMember, [name]: formatted });
    } else {
      setCurrentMember({ ...currentMember, [name]: value });
    }
  };

  const handleAddMember = () => {
    const member = editingMember || currentMember;
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

    // Check if Aadhaar number is already used by other members
    const isDuplicateAadhaar = familyMembers.some(
      (m, idx) => m.aadhaarNumber === member.aadhaarNumber && idx !== editingIndex
    );

    if (isDuplicateAadhaar) {
      setError('This Aadhaar number is already used by another family member');
      return;
    }

    const processedMember = {
      ...member,
      name: member.name.trim(),
      allergies: member.allergies ? member.allergies.split(',').map(item => item.trim()).filter(Boolean) : [],
      conditions: member.conditions ? member.conditions.split(',').map(item => item.trim()).filter(Boolean) : []
    };

    if (onConfirm) {
      // Call onConfirm with just the new member
      onConfirm(processedMember);
    }
    
    handleCloseDialog();
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedMembers);
    if (onConfirm) {
      onConfirm(updatedMembers);
    }
  };

  const handleEditMember = (member, index) => {
    setEditingMember({
      ...member,
      allergies: Array.isArray(member.allergies) ? member.allergies.join(', ') : '',
      conditions: Array.isArray(member.conditions) ? member.conditions.join(', ') : ''
    });
    setEditingIndex(index);
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentMember({
      name: '',
      relation: '',
      aadhaarNumber: '',
      bloodGroup: '',
      allergies: '',
      conditions: ''
    });
    setEditingMember(null);
    setEditingIndex(-1);
    setError('');
    setAddDialogOpen(false);
  };

  const handleOpenAddDialog = () => {
    setEditingMember(null);
    setEditingIndex(-1);
    setAddDialogOpen(true);
  };

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setCurrentMember({
        name: '',
        relation: '',
        aadhaarNumber: '',
        bloodGroup: '',
        allergies: '',
        conditions: ''
      });
      setError('');
    },
    getFamilyMembers: () => familyMembers,
    clearFamilyMembers: () => {
      setFamilyMembers([]);
      if (onConfirm) {
        onConfirm([]);
      }
    }
  }));

  const renderMemberForm = () => {
    const member = editingMember || currentMember;
    return (
      <Grid container spacing={2}>
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Allergies (comma-separated)"
            name="allergies"
            value={member.allergies}
            onChange={handleChange}
            helperText="Enter allergies separated by commas"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical Conditions (comma-separated)"
            name="conditions"
            value={member.conditions}
            onChange={handleChange}
            helperText="Enter conditions separated by commas"
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Family Members
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Family Member
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {familyMembers.length > 0 ? (
        <List>
          {familyMembers.map((member, index) => (
            <ListItem
              key={index}
              sx={{ mb: 2, display: 'block', p: 0 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {member.name} ({member.relation})
                      </Typography>
                      <Typography color="text.secondary">
                        Aadhaar: {member.aadhaarNumber}
                      </Typography>
                      <Typography color="text.secondary">
                        Blood Group: {member.bloodGroup}
                      </Typography>
                      {member.allergies && member.allergies.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">Allergies:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {member.allergies.map((allergy, idx) => (
                              <Typography key={idx} variant="body2" color="text.secondary">
                                {allergy}{idx < member.allergies.length - 1 ? ', ' : ''}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      )}
                      {member.conditions && member.conditions.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">Medical Conditions:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {member.conditions.map((condition, idx) => (
                              <Typography key={idx} variant="body2" color="text.secondary">
                                {condition}{idx < member.conditions.length - 1 ? ', ' : ''}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleEditMember(member, index)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleRemoveMember(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
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

      <Dialog
        open={addDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingMember ? 'Edit Family Member' : 'Add Family Member'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ mt: 2 }}>
            {renderMemberForm()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button onClick={handleAddMember} variant="contained" color="primary">
            {editingMember ? 'Save Changes' : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default FamilyMemberForm; 