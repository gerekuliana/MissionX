import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Container,
  useTheme,
  useMediaQuery,
  Slide,
} from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import { useConsentStore } from '../stores/consentStore';
import { CookieConfigureModal } from './CookieConfigureModal';

export const CookieConsentBanner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isVisible,
    acceptAll,
    declineAll,
    openConfigure,
    initialize,
  } = useConsentStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
            zIndex: theme.zIndex.modal + 1,
          }}
        >
          <Typography variant="body2">
            JavaScript is disabled. Cookie consent cannot be captured without JavaScript enabled.
          </Typography>
        </Box>
      </noscript>

      <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.modal,
            borderRadius: 0,
            borderTop: `4px solid ${theme.palette.primary.main}`,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                py: 3,
                px: { xs: 2, sm: 3 },
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                alignItems={{ xs: 'flex-start', md: 'center' }}
              >
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <CookieIcon color="primary" />
                    <Typography variant="h6" component="h2">
                      Cookie Consent
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    We use cookies to enhance your experience on our platform.
                    These cookies help us understand how you use our services,
                    provide personalized content, and improve our offerings.
                    By clicking "Accept All", you consent to our use of all cookies.
                    You can also configure your preferences or decline non-essential cookies.
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{
                    width: { xs: '100%', md: 'auto' },
                    minWidth: { md: '400px' },
                  }}
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={declineAll}
                    fullWidth={isMobile}
                    sx={{
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'text.primary',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    Decline
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={openConfigure}
                    fullWidth={isMobile}
                  >
                    Configure
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={acceptAll}
                    fullWidth={isMobile}
                  >
                    Accept All
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Container>
        </Paper>
      </Slide>

      <CookieConfigureModal />
    </>
  );
};