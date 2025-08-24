import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useCookieConsentStore } from '../stores/cookieConsentStore';

const CookieBanner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showBanner, acceptAll, declineAll, openConfigModal } = useCookieConsentStore();

  if (!showBanner) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.modal - 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={3}
            alignItems={isMobile ? 'stretch' : 'center'}
            justifyContent="space-between"
          >
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                Cookie Consent
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We use cookies to enhance your browsing experience, analyze site traffic, and
                personalize content. By clicking "Accept All", you consent to our use of cookies.
                You can manage your preferences by clicking "Configure".
              </Typography>
            </Box>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              sx={{ minWidth: isMobile ? 'auto' : 'fit-content' }}
            >
              <Button
                variant="outlined"
                onClick={declineAll}
                size={isMobile ? 'medium' : 'large'}
                sx={{ minWidth: 100 }}
              >
                Decline
              </Button>
              <Button
                variant="outlined"
                onClick={openConfigModal}
                size={isMobile ? 'medium' : 'large'}
                sx={{ minWidth: 100 }}
              >
                Configure
              </Button>
              <Button
                variant="contained"
                onClick={acceptAll}
                size={isMobile ? 'medium' : 'large'}
                sx={{ minWidth: 100 }}
              >
                Accept All
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CookieBanner;