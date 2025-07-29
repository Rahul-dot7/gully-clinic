import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip
} from '@mui/material';
import {
  HealthAndSafety,
  LocalHospital,
  AccountBalance,
  Medication,
  ChildCare,
  ElderlyWoman
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const schemes = [
  {
    id: 1,
    name: "Ayushman Bharat",
    icon: <HealthAndSafety sx={{ fontSize: 40, color: '#1976d2' }} />,
    description: "Provides health coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
    eligibility: "Poor and vulnerable families as per SECC database",
    benefits: [
      "Cashless treatment",
      "Coverage for pre and post hospitalization",
      "All pre-existing conditions covered"
    ],
    website: "https://pmjay.gov.in/",
    category: "Health Insurance"
  },
  {
    id: 2,
    name: "PM Jan Aushadhi Scheme",
    icon: <Medication sx={{ fontSize: 40, color: '#1976d2' }} />,
    description: "Provides quality generic medicines at affordable prices through dedicated outlets.",
    eligibility: "All citizens",
    benefits: [
      "50-90% lower price on medicines",
      "Quality generic drugs",
      "Wide network of stores"
    ],
    website: "https://janaushadhi.gov.in/",
    category: "Medicines"
  },
  {
    id: 3,
    name: "Rashtriya Bal Swasthya Karyakram",
    icon: <ChildCare sx={{ fontSize: 40, color: '#1976d2' }} />,
    description: "Child health screening and early intervention services for children.",
    eligibility: "Children aged 0-18 years",
    benefits: [
      "Free health screening",
      "Early detection of diseases",
      "Free treatment for identified conditions"
    ],
    website: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1190&lid=583",
    category: "Child Health"
  },
  {
    id: 4,
    name: "National Programme for Health Care of Elderly",
    icon: <ElderlyWoman sx={{ fontSize: 40, color: '#1976d2' }} />,
    description: "Provides dedicated healthcare facilities for senior citizens.",
    eligibility: "Senior citizens aged 60 years and above",
    benefits: [
      "Free specialized healthcare",
      "Dedicated geriatric wards",
      "Regular health checkups"
    ],
    website: "https://main.mohfw.gov.in/major-programmes/other-national-health-programmes/national-programme-health-care-elderly-nphce",
    category: "Elderly Care"
  }
];

const GovernmentSchemes = () => {
  const { t } = useTranslation();

  const handleLearnMore = (website) => {
    window.open(website, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {t('governmentSchemes.title')}
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        {t('governmentSchemes.subtitle')}
      </Typography>

      <Grid container spacing={4}>
        {schemes.map((scheme) => (
          <Grid item xs={12} md={6} key={scheme.id}>
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
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {scheme.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {scheme.name}
                  </Typography>
                </Box>
                <Chip 
                  label={scheme.category} 
                  size="small" 
                  color="primary" 
                  sx={{ mb: 2 }} 
                />
                <Typography variant="body2" color="text.secondary" paragraph>
                  {scheme.description}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {t('governmentSchemes.schemes.' + scheme.name.toLowerCase() + '.eligibility')}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {t('governmentSchemes.schemes.' + scheme.name.toLowerCase() + '.benefits')}
                </Typography>
                <ul style={{ margin: 0 }}>
                  {scheme.benefits.map((benefit, index) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {benefit}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions sx={{ mt: 'auto', p: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleLearnMore(scheme.website)}
                >
                  {t('governmentSchemes.learnMore')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GovernmentSchemes; 