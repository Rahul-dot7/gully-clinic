import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Avatar,
  Button,
  Fade
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Chat as ChatIcon } from '@mui/icons-material';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showTechnicalOptions, setShowTechnicalOptions] = useState(false);
  const [showNonTechnicalOptions, setShowNonTechnicalOptions] = useState(false);
  const [showYesNo, setShowYesNo] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);
  const [loginStep, setLoginStep] = useState(1);

  const technicalOptions = [
    "I'm having trouble logging into my account on my phone.",
    "I'm having trouble logging into my account on my laptop.",
    "I can't reset my password—can you help?",
    "How do I update my email or phone number?"
  ];

  const nonTechnicalOptions = [
    "What should I do if I missed my appointment?",
    "Can I reschedule my appointment online?"
  ];

  const handleLoginIssues = () => {
    addMessage("First, please check your internet connection. Is your internet working properly?", true);
    setShowYesNo(true);
    setCurrentIssue('login');
    setLoginStep(1);
  };

  const handlePasswordReset = () => {
    addMessage("To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password. The link in the email will be valid for 24 hours.", true);
    addMessage("Was this helpful?", true);
    setShowYesNo(true);
    setCurrentIssue('password');
  };

  const handleUpdateInfo = () => {
    addMessage("To update your email or phone number, go to your Profile settings. Click on the edit button next to your contact information, make the changes, and click Save.", true);
    addMessage("Was this helpful?", true);
    setShowYesNo(true);
    setCurrentIssue('update');
  };

  const handleMissedAppointment = () => {
    addMessage("If you missed your appointment, please contact our support team within 24 hours to explain the situation. You may be able to reschedule without additional charges depending on the circumstances.", true);
    addMessage("Was this helpful?", true);
    setShowYesNo(true);
    setCurrentIssue('missed');
  };

  const handleRescheduleOnline = () => {
    addMessage("Yes, you can reschedule your appointment online! Go to the Appointments section in your dashboard, find your appointment, and click the 'Reschedule' button. Please note that rescheduling must be done at least 24 hours before your appointment.", true);
    addMessage("Was this helpful?", true);
    setShowYesNo(true);
    setCurrentIssue('reschedule');
  };

  const handleYesNoResponse = (isYes) => {
    if (currentIssue === 'login') {
      if (loginStep === 1) { // First step - Internet check
        if (isYes) {
          addMessage("Please try clearing your browser history and cache, then attempt to log in again.", true);
          setTimeout(() => {
            addMessage("Did this resolve your issue?", true);
            setShowYesNo(true);
            setLoginStep(2);
          }, 1000);
        } else {
          addMessage("Wait for the internet connection to get stable.", true);
          setTimeout(() => {
            addMessage("If the problem continues, we'll let our team handle this.", true);
            setShowYesNo(false);
          }, 1000);
        }
      } else if (loginStep === 2) { // Second step - Resolution check
        if (isYes) {
          addMessage("Great! Glad I could help.", true);
          setShowYesNo(false);
        } else {
          addMessage("I'm sorry I couldn't resolve your issue. I'll connect you with our support team who will help you further.", true);
          addMessage("Our team will contact you at " + (user?.email || "your registered email address") + " within 24 hours.", true);
          setShowYesNo(false);
        }
      }
    } else {
      // For all other issues
      if (isYes) {
        addMessage("Great! Glad I could help.", true);
      } else {
        addMessage("I'm sorry I couldn't resolve your issue. I'll connect you with our support team who will help you further.", true);
        addMessage("Our team will contact you at " + (user?.email || "your registered email address") + " within 24 hours.", true);
      }
      setShowYesNo(false);
    }
  };

  const addMessage = (text, isBot = true) => {
    setMessages(prev => [...prev, { text, isBot, id: Date.now() }]);
  };

  const handleOptionClick = (option) => {
    addMessage(option, false);
    setShowOptions(false);
    setShowTechnicalOptions(false);
    setShowNonTechnicalOptions(false);

    if (option === "Technical Issue") {
      setTimeout(() => setShowTechnicalOptions(true), 500);
    } else if (option === "Non-Technical Issue") {
      setTimeout(() => setShowNonTechnicalOptions(true), 500);
    } else {
      // Handle specific options
      if (option.includes("trouble logging")) {
        handleLoginIssues();
      } else if (option.includes("reset my password")) {
        handlePasswordReset();
      } else if (option.includes("update my email")) {
        handleUpdateInfo();
      } else if (option.includes("missed my appointment")) {
        handleMissedAppointment();
      } else if (option.includes("reschedule")) {
        handleRescheduleOnline();
      }
    }
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      addMessage(`Hi ${user?.name || 'there'}! How can I help you?`);
    }, 1000);

    const timer2 = setTimeout(() => {
      addMessage("Please choose the type of issue you're facing:");
    }, 2000);

    const timer3 = setTimeout(() => {
      setShowOptions(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [user?.name]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3}
        sx={{
          p: 3,
          minHeight: '70vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        {/* Welcome Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          backgroundColor: '#283593',
          color: 'white',
          borderRadius: 1
        }}>
          <Avatar sx={{ bgcolor: '#1a237e', mr: 2 }}>
            <ChatIcon />
          </Avatar>
          <Box>
            <Typography variant="h5">
              Healthcare Support
            </Typography>
            <Typography variant="subtitle1">
              24/7 Chat Assistance
            </Typography>
          </Box>
        </Box>

        {/* Chat Area */}
        <Box sx={{ 
          backgroundColor: 'white',
          p: 2,
          borderRadius: 1,
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '60vh',
          overflow: 'auto'
        }}>
          <Box sx={{ flexGrow: 1, mb: 2 }}>
            {messages.map((message) => (
              <Fade in={true} key={message.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: message.isBot ? '#e3f2fd' : '#e8f5e9',
                      borderRadius: 2,
                      p: 1.5,
                      maxWidth: '70%',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: '8px',
                        borderColor: message.isBot 
                          ? 'transparent transparent transparent #e3f2fd'
                          : 'transparent #e8f5e9 transparent transparent',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        [message.isBot ? 'left' : 'right']: '-8px'
                      }
                    }}
                  >
                    <Typography variant="body1">
                      {message.text}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>

          {/* Main Options */}
          {showOptions && (
            <Fade in={true}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleOptionClick("Technical Issue")}
                  sx={{ backgroundColor: '#283593', '&:hover': { backgroundColor: '#1a237e' } }}
                >
                  Technical Issue
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleOptionClick("Non-Technical Issue")}
                  sx={{ backgroundColor: '#283593', '&:hover': { backgroundColor: '#1a237e' } }}
                >
                  Non-Technical Issue
                </Button>
              </Box>
            </Fade>
          )}

          {/* Technical Options */}
          {showTechnicalOptions && (
            <Fade in={true}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {technicalOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handleOptionClick(option)}
                    sx={{ 
                      borderColor: '#283593', 
                      color: '#283593',
                      '&:hover': { 
                        borderColor: '#1a237e',
                        backgroundColor: 'rgba(40, 53, 147, 0.04)'
                      }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </Fade>
          )}

          {/* Non-Technical Options */}
          {showNonTechnicalOptions && (
            <Fade in={true}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {nonTechnicalOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handleOptionClick(option)}
                    sx={{ 
                      borderColor: '#283593', 
                      color: '#283593',
                      '&:hover': { 
                        borderColor: '#1a237e',
                        backgroundColor: 'rgba(40, 53, 147, 0.04)'
                      }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </Fade>
          )}

          {/* Yes/No Options */}
          {showYesNo && (
            <Fade in={true}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleYesNoResponse(true)}
                  sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleYesNoResponse(false)}
                  sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
                >
                  No
                </Button>
              </Box>
            </Fade>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat; 