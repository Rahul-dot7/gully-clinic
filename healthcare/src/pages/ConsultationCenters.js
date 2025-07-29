import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const hospitals = [
  {
    id: 1,
    name: "Children's Care Hospital",
    marathiName: "चिल्ड्रन्स केअर हॉस्पिटल",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    location: "123 Healthcare Street, Mumbai",
    timing: "9:00 AM - 6:00 PM",
    speciality: "Pediatric Care"
  },
  {
    id: 2,
    name: "Kids Health Center",
    marathiName: "किड्स हेल्थ सेंटर",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    location: "456 Medical Avenue, Andheri West",
    timing: "24/7",
    speciality: "Child Specialist"
  },
  {
    id: 3,
    name: "Little Hearts Hospital",
    marathiName: "लिटल हार्ट्स हॉस्पिटल",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    location: "789 Child Care Lane, Bandra",
    timing: "8:00 AM - 8:00 PM",
    speciality: "Child Care"
  },
  {
    id: 4,
    name: "Young Care Medical",
    marathiName: "यंग केअर मेडिकल",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400",
    location: "101 Pediatric Lane, Powai",
    timing: "9:00 AM - 7:00 PM",
    speciality: "Pediatric Specialist"
  }
];

const ConsultationCenters = () => {
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [bookingData, setBookingData] = useState({
    patientName: '',
    age: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
    department: selectedHospital?.speciality || ''
  });

  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const handleBooking = (hospital) => {
    setSelectedHospital(hospital);
    setBookingData(prev => ({
      ...prev,
      department: hospital.speciality
    }));
    setOpenBooking(true);
  };

  const handleCloseBooking = () => {
    setOpenBooking(false);
    setBookingData({
      patientName: '',
      age: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      description: '',
      department: selectedHospital?.speciality || ''
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
      // Validate required fields
      if (!bookingData.patientName || !bookingData.age || !bookingData.phone || 
          !bookingData.preferredDate || !bookingData.preferredTime) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate phone number
      if (!/^[0-9]{10}$/.test(bookingData.phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }

      const consultationData = {
        patientName: bookingData.patientName.trim(),
        age: bookingData.age.toString(),
        phone: bookingData.phone,
        preferredDate: new Date(bookingData.preferredDate).toISOString(),
        preferredTime: bookingData.preferredTime,
        description: bookingData.description?.trim() || '',
        department: selectedHospital.speciality,
        hospitalId: selectedHospital.id.toString(),
        hospitalName: selectedHospital.name,
        status: 'pending'
      };

      console.log('=== Sending Consultation Data ===');
      console.log(JSON.stringify(consultationData, null, 2));

      const response = await axios.post('http://localhost:5000/api/consultations', consultationData);
      console.log('=== Server Response ===');
      console.log(response.data);

      if (response.status === 201) {
        alert('Consultation booked successfully!');
        handleCloseBooking();
      }
    } catch (error) {
      console.error('=== Error Details ===');
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('Full error:', error);

      let errorMessage = 'Error booking consultation';
      
      if (error.response?.data?.errors) {
        errorMessage = `Validation errors:\n${error.response.data.errors.join('\n')}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      alert(`Booking failed: ${errorMessage}`);
    }
  };

  // Add this function to test the connection
  const testConnection = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/consultations/test');
      console.log('Test response:', response.data);
      alert('Connection successful!');
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('Connection failed: ' + error.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center"
        sx={{ mb: 3 }}
      >
        {t('hospitals.title')}
      </Typography>
      <Grid 
        container 
        spacing={4} 
        justifyContent="center"
      >
        {hospitals.map((hospital) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={hospital.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={hospital.image}
                alt={hospital.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {i18n.language === 'mr' ? hospital.marathiName : hospital.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>{t('common.location')}:</strong> {hospital.location}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>{t('common.timing')}:</strong> {hospital.timing}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>{t('common.speciality')}:</strong> {hospital.speciality}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  fullWidth 
                  variant="contained"
                  onClick={() => handleBooking(hospital)}
                  sx={{
                    mt: 'auto',
                    mb: 1,
                    mx: 1
                  }}
                >
                  {t('common.bookConsultation')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openBooking} onClose={handleCloseBooking} maxWidth="sm" fullWidth>
        <DialogTitle>{t('booking.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('booking.patientName')}
              name="patientName"
              value={bookingData.patientName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('booking.age')}
              name="age"
              type="number"
              value={bookingData.age}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('booking.phone')}
              name="phone"
              value={bookingData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('common.department')}
              name="department"
              value={selectedHospital?.speciality || bookingData.department}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('booking.preferredDate')}
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
              label={t('booking.preferredTime')}
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
              label={t('booking.description')}
              name="description"
              multiline
              rows={4}
              value={bookingData.description}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBooking}>{t('booking.cancel')}</Button>
          <Button onClick={testConnection} color="secondary">
            {t('common.testConnection')}
          </Button>
          <Button onClick={handleSubmitBooking} variant="contained">
            {t('booking.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultationCenters; 