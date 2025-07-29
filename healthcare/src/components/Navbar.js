import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Stack,
  Menu,
  MenuItem 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLanguageMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#1a237e',
        '& .MuiButton-root': {
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="button"
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: '1rem',
            fontWeight: 500,
            letterSpacing: '0.02857em'
          }}
        >
          GULLY CLINIC
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button onClick={() => navigate('/consultation-centers')}>
            {t('navigation.consultationCenters')}
          </Button>
          <Button onClick={() => navigate('/specialist-doctors')}>
            {t('navigation.specialistDoctors')}
          </Button>
          <Button onClick={() => navigate('/government-schemes')}>
            {t('navigation.governmentSchemes')}
          </Button>
          <Button onClick={() => navigate('/pharmacies')}>
            {t('navigation.pharmacies')}
          </Button>
          
          {/* Language Selection Button */}
          <IconButton
            color="inherit"
            onClick={handleLanguageMenu}
            sx={{ ml: 2 }}
          >
            <LanguageIcon />
          </IconButton>
        </Stack>

        {/* Language Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>
            English
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('mr')}>
            मराठी
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('hi')}>
            हिंदी
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 