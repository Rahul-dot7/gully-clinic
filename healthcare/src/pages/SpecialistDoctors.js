import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { doctorsData, specialties, hospitals } from '../data/doctorsData';

const SpecialistDoctors = () => {
  const { t } = useTranslation();
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesHospital = !selectedHospital || doctor.hospital === selectedHospital;
    return matchesSpecialty && matchesHospital;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        {t('specialistDoctors.title')}
      </Typography>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>{t('specialistDoctors.selectSpecialty')}</InputLabel>
          <Select
            value={selectedSpecialty}
            label={t('specialistDoctors.selectSpecialty')}
            onChange={handleSpecialtyChange}
          >
            <MenuItem value="">All Specialties</MenuItem>
            {specialties.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Select Hospital</InputLabel>
          <Select
            value={selectedHospital}
            label="Select Hospital"
            onChange={handleHospitalChange}
          >
            <MenuItem value="">All Hospitals</MenuItem>
            {hospitals.map((hospital) => (
              <MenuItem key={hospital} value={hospital}>
                {hospital}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Doctors Grid */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 2,
                height: '100%',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <Typography variant="h6" gutterBottom>
                {doctor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Specialty:</strong> {doctor.specialty}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Hospital:</strong> {doctor.hospital}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Availability:</strong> {doctor.availability}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Building:</strong> {doctor.building}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Floor:</strong> {doctor.floor}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SpecialistDoctors; 