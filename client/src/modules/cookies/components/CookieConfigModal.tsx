import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCookieConsentStore } from '../stores/cookieConsentStore';
import { CookieCategory } from '../types/cookies';

interface CategoryConfig {
  key: keyof typeof CookieCategory;
  title: string;
  description: string;
  required?: boolean;
}

const categories: CategoryConfig[] = [
  {
    key: 'ESSENTIAL',
    title: 'Essential Cookies',
    description:
      'These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.',
    required: true,
  },
  {
    key: 'ANALYTICS',
    title: 'Analytics/Performance Cookies',
    description:
      'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular and see how visitors move around the site.',
  },
  {
    key: 'MARKETING',
    title: 'Marketing/Advertising Cookies',
    description:
      'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant ads on other sites.',
  },
  {
    key: 'FUNCTIONAL',
    title: 'Functional/Preferences Cookies',
    description:
      'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
  },
];

const CookieConfigModal: React.FC = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    showConfigModal,
    closeConfigModal,
    tempConsent,
    updateTempConsent,
    savePreferences,
    acceptAll,
    declineAll,
  } = useCookieConsentStore();

  const handleSave = () => {
    savePreferences(tempConsent);
  };

  if (!showConfigModal) {
    return null;
  }

  return (
    <Dialog
      open={showConfigModal}
      onClose={closeConfigModal}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Cookie Preferences</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeConfigModal}
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" paragraph>
          When you visit our website, we may store or retrieve information on your browser,
          mostly in the form of cookies. This information might be about you, your preferences,
          or your device and is mostly used to make the site work as you expect it to.
        </Typography>

        <Stack spacing={3} sx={{ mt: 3 }}>
          {categories.map((category) => {
            const categoryKey = category.key.toLowerCase() as keyof typeof tempConsent;
            const isChecked = tempConsent[categoryKey] as boolean;

            return (
              <Box key={category.key}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isChecked}
                      onChange={(e) => updateTempConsent(categoryKey, e.target.checked)}
                      disabled={category.required}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {category.title}
                        {category.required && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            (Always Active)
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                  {category.description}
                </Typography>
                {category.key !== categories[categories.length - 1].key && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={declineAll} color="inherit">
          Reject All
        </Button>
        <Button onClick={acceptAll} color="inherit">
          Accept All
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CookieConfigModal;