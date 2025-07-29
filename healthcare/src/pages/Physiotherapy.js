import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  AccessibilityNew,
  LocationOn,
  Phone,
  AccessTime,
  LocalOffer
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const centers = [
  {
    id: 1,
    name: "HealthCare Physio Center",
    address: "123 Rehab Street, Mumbai Central",
    phone: "+91 98765 43210",
    timing: "9:00 AM - 8:00 PM",
    services: [
      {
        name: "General Physiotherapy",
        price: "₹500",
        duration: "45 mins"
      },
      {
        name: "Sports Rehabilitation",
        price: "₹800",
        duration: "60 mins"
      },
      {
        name: "Senior Citizen Special",
        price: "₹400",
        duration: "45 mins"
      }
    ],
    features: [
      "Experienced therapists",
      "Modern equipment",
      "Home visits available"
    ],
    subsidizedRates: "20% discount for BPL card holders"
  },
  {
    id: 2,
    name: "Mobility Care Center",
    address: "456 Wellness Avenue, Andheri West",
    phone: "+91 98765 43211",
    timing: "8:00 AM - 9:00 PM",
    services: [
      {
        name: "Orthopedic Rehabilitation",
        price: "₹600",
        duration: "45 mins"
      },
      {
        name: "Neurological Rehabilitation",
        price: "₹900",
        duration: "60 mins"
      },
      {
        name: "Pediatric Physiotherapy",
        price: "₹500",
        duration: "45 mins"
      }
    ],
    features: [
      "Child-friendly environment",
      "Advanced therapy equipment",
      "Free consultation"
    ],
    subsidizedRates: "30% discount for government employees"
  }
];

const Physiotherapy = () => {
  const { t } = useTranslation();
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [bookingData, setBookingData] = useState({
    patientName: '',
    age: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    medicalHistory: ''
  });

  const handleBooking = (center) => {
    setSelectedCenter(center);
    setOpenBooking(true);
  };

  const handleCloseBooking = () => {
    setOpenBooking(false);
    setBookingData({
      patientName: '',
      age: '',
      phone: '',
      service: '',
      preferredDate: '',
      preferredTime: '',
      medicalHistory: ''
    });
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitBooking = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/physiotherapy/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          centerId: selectedCenter.id,
          centerName: selectedCenter.name
        }),
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
        handleCloseBooking();
      } else {
        alert('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {t('physiotherapy.title')}
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        {t('physiotherapy.subtitle')}
      </Typography>

      <Grid container spacing={4}>
        {centers.map((center) => (
          <Grid item xs={12} md={6} key={center.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessibilityNew sx={{ fontSize: 40, color: '#1976d2' }} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {center.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <LocationOn sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                  {center.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <AccessTime sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                  {center.timing}
                </Typography>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  {t('physiotherapy.services')}:
                </Typography>
                <ul>
                  {center.services.map((service, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {service.name} - {service.price} ({service.duration})
                      </Typography>
                    </li>
                  ))}
                </ul>

                <Typography variant="subtitle2" gutterBottom>
                  {t('physiotherapy.features')}:
                </Typography>
                <ul>
                  {center.features.map((feature, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>

                {center.subsidizedRates && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    <LocalOffer sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                    {t('physiotherapy.discountInfo')}: {center.subsidizedRates}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleBooking(center)}
                >
                  {t('physiotherapy.bookSession')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openBooking} onClose={handleCloseBooking} maxWidth="sm" fullWidth>
        <DialogTitle>{t('physiotherapy.bookingForm.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('physiotherapy.bookingForm.patientName')}
              name="patientName"
              value={bookingData.patientName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('physiotherapy.bookingForm.age')}
              name="age"
              value={bookingData.age}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('physiotherapy.bookingForm.phone')}
              name="phone"
              value={bookingData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label={t('physiotherapy.bookingForm.service')}
              name="service"
              value={bookingData.service}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              {selectedCenter?.services.map((service) => (
                <MenuItem key={service.name} value={service.name}>
                  {service.name} - {service.price}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label={t('physiotherapy.bookingForm.preferredDate')}
              name="preferredDate"
              type="date"
              value={bookingData.preferredDate}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label={t('physiotherapy.bookingForm.preferredTime')}
              name="preferredTime"
              type="time"
              value={bookingData.preferredTime}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label={t('physiotherapy.bookingForm.medicalHistory')}
              name="medicalHistory"
              multiline
              rows={4}
              value={bookingData.medicalHistory}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBooking}>
            {t('physiotherapy.bookingForm.cancel')}
          </Button>
          <Button onClick={handleSubmitBooking} variant="contained">
            {t('physiotherapy.bookingForm.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Physiotherapy; 