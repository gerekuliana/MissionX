import React, { useEffect } from 'react';
import { Box, Paper, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { useCookieConsentStore } from '../stores/cookieConsentStore';
import ConfigureModal from './ConfigureModal';

const CookieBanner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    hasConsent,
    isConfigureModalOpen,
    acceptAll,
    declineAll,
    openConfigureModal,
    loadConsentFromStorage,
  } = useCookieConsentStore();

  useEffect(() => {
    loadConsentFromStorage();
  }, [loadConsentFromStorage]);

  if (hasConsent) {
    return null;
  }

  return (
    <>
      <noscript>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'error.main',
            color: 'error.contrastText',
            p: 2,
            textAlign: 'center',
            zIndex: theme.zIndex.snackbar + 1,
          }}
        >
          <Typography>
            JavaScript is disabled. Cookie consent cannot be captured without JavaScript enabled.
            Please enable JavaScript to manage cookie preferences.
          </Typography>
        </Box>
      </noscript>

      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.snackbar,
          borderRadius: 0,
          borderTop: `2px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 3,
              px: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                We use cookies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We use cookies and similar technologies to enhance your experience on our site,
                analyze site traffic, and deliver personalized content. You can manage your
                preferences or accept all cookies.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
                minWidth: { md: 'auto' },
              }}
            >
              <Button
                variant="outlined"
                onClick={declineAll}
                size={isMobile ? 'medium' : 'large'}
                fullWidth={isMobile}
                sx={{
                  minWidth: { sm: 100 },
                }}
              >
                Decline
              </Button>
              <Button
                variant="outlined"
                onClick={openConfigureModal}
                size={isMobile ? 'medium' : 'large'}
                fullWidth={isMobile}
                sx={{
                  minWidth: { sm: 120 },
                }}
              >
                Configure
              </Button>
              <Button
                variant="contained"
                onClick={acceptAll}
                size={isMobile ? 'medium' : 'large'}
                fullWidth={isMobile}
                sx={{
                  minWidth: { sm: 120 },
                }}
              >
                Accept All
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      <ConfigureModal open={isConfigureModalOpen} />
    </>
  );
};

export default CookieBanner;