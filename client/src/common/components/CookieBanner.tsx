import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  Stack,
  Link,
  Slide,
} from '@mui/material';
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

  return (
    <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box flex={1}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Cookie Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We use cookies to enhance your experience, analyze site traffic, and serve personalized content.
                This includes essential cookies for authentication (Clerk), functional cookies for site features,
                analytics cookies for usage insights, and third-party cookies for enhanced functionality.
                {' '}
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  sx={{ color: 'primary.main', textDecoration: 'underline' }}
                >
                  Learn more
                </Link>
              </Typography>
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ minWidth: { sm: 'auto' } }}
            >
              <Button
                variant="outlined"
                onClick={handleDecline}
                size="large"
                sx={{
                  minWidth: 120,
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                Decline
              </Button>
              <Button
                variant="contained"
                onClick={handleAcceptAll}
                size="large"
                sx={{
                  minWidth: 120,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Accept All
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Paper>
    </Slide>
  );
};

export default CookieBanner;