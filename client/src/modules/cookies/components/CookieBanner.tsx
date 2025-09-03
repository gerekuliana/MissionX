import React, { useEffect } from 'react';
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
import CookieIcon from '@mui/icons-material/Cookie';
import { useCookieConsentStore } from '../stores/cookieConsentStore';

const CookieBanner: React.FC = () => {
  const { showBanner, consentGiven, acceptAll, declineAll } = useCookieConsentStore();

  useEffect(() => {
    // Check if we need to show the banner on mount
    // If user hasn't given consent yet, the banner should be shown
    if (!consentGiven && !showBanner) {
      useCookieConsentStore.setState({ showBanner: true });
    }
  }, [consentGiven, showBanner]);

  if (!showBanner || consentGiven) {
    return null;
  }

  return (
    <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'background.paper',
          borderTop: 2,
          borderColor: 'primary.main',
        }}
      >
        <Container maxWidth="lg">
          <Box py={3}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CookieIcon color="primary" fontSize="large" />
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>
                    Cookie Consent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We use cookies to enhance your browsing experience, serve personalized content,
                    and analyze our traffic. We use three types of cookies:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="ul" sx={{ mt: 1, pl: 2 }}>
                    <li><strong>Essential cookies:</strong> Required for the website to function properly (authentication, security)</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Marketing cookies:</strong> Used to track visitors across websites for advertising purposes</li>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    By clicking "Accept All", you consent to the use of ALL cookies.
                    By clicking "Decline", only essential cookies will be used.
                    For more information, please read our{' '}
                    <Link href="/privacy-policy" target="_blank" rel="noopener">
                      Privacy Policy
                    </Link>
                    {' '}and{' '}
                    <Link href="/cookie-policy" target="_blank" rel="noopener">
                      Cookie Policy
                    </Link>.
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={declineAll}
                  sx={{ minWidth: 120 }}
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={acceptAll}
                  sx={{ minWidth: 120 }}
                >
                  Accept All
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Paper>
    </Slide>
  );
};

export default CookieBanner;