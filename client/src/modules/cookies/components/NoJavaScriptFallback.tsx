import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const NoJavaScriptFallback: React.FC = () => {
  return (
    <noscript>
      <Alert severity="error" sx={{ m: 2 }}>
        <AlertTitle>JavaScript Required</AlertTitle>
        Cookie consent cannot be captured without JavaScript enabled. Please enable JavaScript in
        your browser settings to manage cookie preferences.
      </Alert>
    </noscript>
  );
};

export default NoJavaScriptFallback;