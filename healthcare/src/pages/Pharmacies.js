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
  TextField
} from '@mui/material';
import {
  LocalPharmacy,
  Bloodtype,
  AccessTime,
  Phone,
  LocationOn,
  Discount
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const pharmacies = [
  {
    id: 1,
    name: "LifeCare Pharmacy",
    type: "Pharmacy",
    icon: <LocalPharmacy sx={{ fontSize: 40, color: '#1976d2' }} />,
    address: "123 Health Street, Mumbai Central",
    phone: "+91 98765 43210",
    timing: "24/7",
    discounts: "10% off on generic medicines",
    features: [
      "Home delivery available",
      "Generic medicines available",
      "Online prescriptions accepted"
    ],
    stockAvailability: true
  },
  {
    id: 2,
    name: "City Blood Bank",
    type: "Blood Bank",
    icon: <Bloodtype sx={{ fontSize: 40, color: '#d32f2f' }} />,
    address: "456 Medical Avenue, Andheri West",
    phone: "+91 98765 43211",
    timing: "8:00 AM - 8:00 PM",
    features: [
      "All blood groups available",
      "Component separation facility",
      "Emergency services"
    ],
    stockAvailability: true
  },
  {
    id: 3,
    name: "MediPlus Pharmacy",
    type: "Pharmacy",
    icon: <LocalPharmacy sx={{ fontSize: 40, color: '#1976d2' }} />,
    address: "789 Health Lane, Bandra",
    phone: "+91 98765 43212",
    timing: "8:00 AM - 11:00 PM",
    discounts: "15% off for senior citizens",
    features: [
      "Wide range of medicines",
      "Healthcare products",
      "Monthly medicine subscriptions"
    ],
    stockAvailability: true
  }
];

const Pharmacies = () => {
  const { t } = useTranslation();
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    phone: '',
    medicine: '',
    quantity: '',
    message: ''
  });

  const handleEnquiry = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setOpenEnquiry(true);
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleCloseEnquiry = () => {
    setOpenEnquiry(false);
    setEnquiryData({
      name: '',
      phone: '',
      medicine: '',
      quantity: '',
      message: ''
    });
  };

  const handleInputChange = (e) => {
    setEnquiryData({
      ...enquiryData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitEnquiry = async () => {
    try {
      // Validate required fields
      if (!enquiryData.name || !enquiryData.phone || !enquiryData.medicine || !enquiryData.quantity) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate phone number
      if (!/^[0-9]{10}$/.test(enquiryData.phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }

      const response = await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enquiryData,
          pharmacyId: selectedPharmacy.id,
          pharmacyName: selectedPharmacy.name,
          status: 'pending'
        }),
      });

      if (response.ok) {
        alert('Enquiry submitted successfully!');
        handleCloseEnquiry();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert(error.message || 'Error submitting enquiry');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {t('pharmacies.title')}
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        {t('pharmacies.subtitle')}
      </Typography>

      <Grid container spacing={4}>
        {pharmacies.map((pharmacy) => (
          <Grid item xs={12} md={6} key={pharmacy.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {pharmacy.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {pharmacy.name}
                  </Typography>
                </Box>
                <Chip 
                  label={t(`pharmacies.type.${pharmacy.type.toLowerCase()}`)}
                  size="small" 
                  color="primary" 
                  sx={{ mb: 2 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  <LocationOn sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                  {pharmacy.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <AccessTime sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                  {pharmacy.timing}
                </Typography>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  {t('pharmacies.features')}:
                </Typography>
                <ul>
                  {pharmacy.features.map((feature, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions sx={{ p: 2, display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => handleCall(pharmacy.phone)}
                  startIcon={<Phone />}
                >
                  {t('pharmacies.callNow')}
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleEnquiry(pharmacy)}
                >
                  {t('pharmacies.enquire')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openEnquiry} onClose={handleCloseEnquiry} maxWidth="sm" fullWidth>
        <DialogTitle>{t('pharmacies.enquiryForm.title')} {selectedPharmacy?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('pharmacies.enquiryForm.name')}
              name="name"
              value={enquiryData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('pharmacies.enquiryForm.phone')}
              name="phone"
              value={enquiryData.phone}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('pharmacies.enquiryForm.medicine')}
              name="medicine"
              value={enquiryData.medicine}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('pharmacies.enquiryForm.quantity')}
              name="quantity"
              value={enquiryData.quantity}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t('pharmacies.enquiryForm.message')}
              name="message"
              multiline
              rows={4}
              value={enquiryData.message}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEnquiry}>
            {t('pharmacies.enquiryForm.cancel')}
          </Button>
          <Button onClick={handleSubmitEnquiry} variant="contained">
            {t('pharmacies.enquiryForm.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pharmacies; 