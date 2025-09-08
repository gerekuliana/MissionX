import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTheme } from '../../themes/useTheme';

const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'neon-green':
        return <AutoAwesomeIcon sx={{ color: '#00FF00' }} />;
      case 'neon-pink':
        return <AutoAwesomeIcon sx={{ color: '#FF4DFF' }} />;
      case 'light':
        return <Brightness7Icon />;
      case 'dark':
        return <Brightness4Icon />;
      default:
        return <AutoAwesomeIcon />;
    }
  };

  const getTooltipText = () => {
    if (themeMode === 'neon-green') return 'Switch to Neon Pink theme';
    if (themeMode === 'neon-pink') return 'Switch to Neon Green theme';
    return themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  };

  return (
    <Tooltip title={getTooltipText()} arrow>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label={getTooltipText()}
        sx={{
          ml: 1,
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {getThemeIcon()}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;