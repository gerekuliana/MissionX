import React from 'react';
import { Box, Switch, Typography, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { themeName, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: themeName === 'neonDarkGreen' ? muiTheme.palette.primary.main : 'inherit',
          fontWeight: themeName === 'neonDarkGreen' ? 600 : 400,
        }}
      >
        Green
      </Typography>
      <Switch
        checked={themeName === 'neonPinkyDark'}
        onChange={toggleTheme}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#ec4899',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#ec4899',
          },
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: themeName === 'neonPinkyDark' ? muiTheme.palette.primary.main : 'inherit',
          fontWeight: themeName === 'neonPinkyDark' ? 600 : 400,
        }}
      >
        Pink
      </Typography>
    </Box>
  );
};

export default ThemeSwitcher;