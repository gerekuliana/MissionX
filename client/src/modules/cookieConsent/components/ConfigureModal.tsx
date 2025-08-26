import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCookieConsentStore } from '../stores/cookieConsentStore';
import { CookieCategory } from '../types/cookieConsent';

interface ConfigureModalProps {
  open: boolean;
}

const categoryInfo = {
  [CookieCategory.ESSENTIAL]: {
    title: 'Essential/Necessary',
    description: 'These cookies are essential for the website to function properly. They cannot be disabled.',
  },
  [CookieCategory.ANALYTICS]: {
    title: 'Analytics/Performance',
    description: 'These cookies help us understand how visitors interact with our website, allowing us to improve performance and user experience.',
  },
  [CookieCategory.MARKETING]: {
    title: 'Marketing/Advertising',
    description: 'These cookies are used to deliver personalized advertisements and track advertising campaign effectiveness.',
  },
  [CookieCategory.FUNCTIONAL]: {
    title: 'Functional/Preferences',
    description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
  },
};

const ConfigureModal: React.FC<ConfigureModalProps> = ({ open }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    preferences,
    closeConfigureModal,
    updateCategoryPreference,
    savePreferences,
  } = useCookieConsentStore();

  const handleSave = () => {
    savePreferences(preferences);
  };

  const handleDeclineAll = () => {
    const essentialOnlyPreferences = {
      [CookieCategory.ESSENTIAL]: true,
      [CookieCategory.ANALYTICS]: false,
      [CookieCategory.MARKETING]: false,
      [CookieCategory.FUNCTIONAL]: false,
    };
    savePreferences(essentialOnlyPreferences);
  };

  const handleAcceptAll = () => {
    const allAcceptedPreferences = {
      [CookieCategory.ESSENTIAL]: true,
      [CookieCategory.ANALYTICS]: true,
      [CookieCategory.MARKETING]: true,
      [CookieCategory.FUNCTIONAL]: true,
    };
    savePreferences(allAcceptedPreferences);
  };

  return (
    <Dialog
      open={open}
      onClose={closeConfigureModal}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'relative',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        Cookie Preferences
        <IconButton
          aria-label="close"
          onClick={closeConfigureModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" paragraph>
          We use different types of cookies to optimize your experience on our site.
          Click on the categories below to learn more about their purpose. You can
          change your cookie settings at any time.
        </Typography>

        <Box sx={{ mt: 3 }}>
          {Object.entries(categoryInfo).map(([category, info], index) => {
            const categoryKey = category as CookieCategory;
            const isEssential = categoryKey === CookieCategory.ESSENTIAL;

            return (
              <Box key={category}>
                {index > 0 && <Divider sx={{ my: 2 }} />}

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {info.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.description}
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences[categoryKey]}
                        onChange={(e) => updateCategoryPreference(categoryKey, e.target.checked)}
                        disabled={isEssential}
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleDeclineAll} variant="outlined">
            Decline All
          </Button>
          <Button onClick={handleAcceptAll} variant="outlined">
            Accept All
          </Button>
        </Box>
        <Button onClick={handleSave} variant="contained">
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigureModal;