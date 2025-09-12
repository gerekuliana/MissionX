import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Link,
  Card,
  CardContent,
  Fade,
  IconButton,
} from '@mui/material';
import { CookieOutlined, Close } from '@mui/icons-material';
import { cookieManager } from '../utils/cookieManager';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsented = cookieManager.hasUserConsented();
    if (!hasConsented) {
      setShowBanner(true);
      cookieManager.blockNonEssentialCookies();
    } else {
      const preferences = cookieManager.getPreferences();
      if (preferences?.consent === 'accepted') {
        cookieManager.allowAllCookies();
      } else if (preferences?.consent === 'declined') {
        cookieManager.blockNonEssentialCookies();
      }
    }
  }, []);

  const handleAcceptAll = () => {
    cookieManager.savePreferences('accepted');
    cookieManager.allowAllCookies();
    setShowBanner(false);
  };

  const handleDecline = () => {
    cookieManager.savePreferences('declined');
    cookieManager.blockNonEssentialCookies();
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  return (
    <>
      <Fade in={showBanner} timeout={500}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
            display: showBanner ? 'block' : 'none',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              p: 2,
            }}
          >
            <Container maxWidth="lg">
              <Card
                elevation={16}
                sx={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                  border: '1px solid rgba(144, 202, 249, 0.2)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'visible',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(144, 202, 249, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #90CAF9 0%, #42A5F5 50%, #90CAF9 100%)',
                    borderRadius: '12px 12px 0 0',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <IconButton
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'text.primary',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    size="small"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                  
                  <Stack spacing={3}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(144, 202, 249, 0.2) 0%, rgba(66, 165, 245, 0.2) 100%)',
                          color: 'primary.main',
                        }}
                      >
                        <CookieOutlined fontSize="medium" />
                      </Box>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #90CAF9 0%, #42A5F5 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5,
                          }}
                        >
                          Cookie Preferences
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Enhance your experience with personalized content
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                      We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
                      This includes essential cookies for authentication (Clerk), functional cookies for site features,
                      analytics cookies for usage insights, and third-party cookies for enhanced functionality.
                      {' '}
                      <Link
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        sx={{ 
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Learn more about our privacy policy
                      </Link>
                    </Typography>
                    
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="outlined"
                        onClick={handleDecline}
                        sx={{
                          minWidth: 130,
                          fontWeight: 600,
                          borderRadius: 2,
                          borderWidth: 2,
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'text.primary',
                          textTransform: 'none',
                          py: 1.25,
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        Decline All
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleAcceptAll}
                        sx={{
                          minWidth: 130,
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: 'none',
                          py: 1.25,
                          background: 'linear-gradient(135deg, #90CAF9 0%, #42A5F5 100%)',
                          color: '#000000',
                          boxShadow: '0 4px 16px rgba(144, 202, 249, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #42A5F5 0%, #1976D2 100%)',
                            boxShadow: '0 6px 20px rgba(144, 202, 249, 0.6)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Accept All
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Container>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default CookieBanner;