import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1a237e',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#fff',
      },
      text: {
        primary: isDarkMode ? '#fff' : '#000000',
        secondary: isDarkMode ? '#b0b0b0' : '#666666',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: 'inherit'
          },
          h4: {
            color: isDarkMode ? '#fff' : '#000000'
          },
          h6: {
            color: isDarkMode ? '#fff' : '#000000'
          },
          body1: {
            color: isDarkMode ? '#fff' : '#000000'
          },
          body2: {
            color: isDarkMode ? '#b0b0b0' : '#666666'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: 'inherit'
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            color: isDarkMode ? '#fff' : '#000000'
          }
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#fff' : '#000000'
          }
        }
      }
    }
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 