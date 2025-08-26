import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { COOKIE_CATEGORIES } from '../types/consent';
import { useConsentStore } from '../stores/consentStore';

export const CookieConfigureModal: React.FC = () => {
  const {
    isConfigureOpen,
    tempPreferences,
    closeConfigure,
    updateTempPreference,
    savePreferences,
  } = useConsentStore();

  if (!tempPreferences) return null;

  return (
    <Dialog
      open={isConfigureOpen}
      onClose={closeConfigure}
      maxWidth="sm"
      fullWidth
      aria-labelledby="cookie-preferences-title"
    >
      <DialogTitle id="cookie-preferences-title">
        Cookie Preferences
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          We use cookies to enhance your browsing experience and analyze our traffic.
          Please choose which types of cookies you want to allow.
        </Typography>

        <FormGroup>
          {COOKIE_CATEGORIES.map((category) => (
            <Box key={category.id} sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={tempPreferences[category.id as keyof typeof tempPreferences]}
                    onChange={(e) => updateTempPreference(category.id, e.target.checked)}
                    disabled={category.required}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2">
                      {category.name}
                      {category.required && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          (Always enabled)
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                }
              />
              {category.id !== 'functional' && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </FormGroup>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={closeConfigure}
          color="inherit"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={savePreferences}
          variant="contained"
          color="primary"
        >
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};