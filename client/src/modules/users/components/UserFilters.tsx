import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent,
  Button,
  Stack,
  useTheme,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../../roles/roleQueries';
import { ROLE_QUERY_KEYS } from '../../roles/roleQueryKeys';
import { UserFilters } from '../userQueries';
import { Role } from '../types/user';

interface UserFiltersComponentProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

const UserFiltersComponent: React.FC<UserFiltersComponentProps> = ({ filters, onFiltersChange }) => {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<UserFilters>(filters);

  const { data: rolesData } = useQuery({
    queryKey: [ROLE_QUERY_KEYS.GET_ROLES],
    queryFn: getRoles,
  });

  const roles: Role[] = rolesData?.data || [];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleTextFieldChange = (field: 'email' | 'name', value: string): void => {
    const newFilters = { ...localFilters, [field]: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleTextFieldBlur = (): void => {
    onFiltersChange(localFilters);
  };

  const handleTextFieldKeyPress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      onFiltersChange(localFilters);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>): void => {
    const value = event.target.value;
    const newFilters = {
      ...localFilters,
      isActive: value === '' ? undefined : value === 'active',
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRolesChange = (event: SelectChangeEvent<string[]>): void => {
    const value = event.target.value as string[];
    const newFilters = {
      ...localFilters,
      roleIds: value.length > 0 ? value : undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = (): void => {
    const clearedFilters: UserFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Boolean(
    localFilters.email ||
    localFilters.name ||
    localFilters.isActive !== undefined ||
    (localFilters.roleIds && localFilters.roleIds.length > 0)
  );

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <TextField
        label="Email"
        value={localFilters.email || ''}
        onChange={(e) => handleTextFieldChange('email', e.target.value)}
        onBlur={handleTextFieldBlur}
        onKeyPress={handleTextFieldKeyPress}
        size="small"
        sx={{ minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: localFilters.email && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  handleTextFieldChange('email', '');
                  onFiltersChange({ ...localFilters, email: undefined });
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Name"
        value={localFilters.name || ''}
        onChange={(e) => handleTextFieldChange('name', e.target.value)}
        onBlur={handleTextFieldBlur}
        onKeyPress={handleTextFieldKeyPress}
        size="small"
        sx={{ minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: localFilters.name && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  handleTextFieldChange('name', '');
                  onFiltersChange({ ...localFilters, name: undefined });
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={
            localFilters.isActive === undefined
              ? ''
              : localFilters.isActive
              ? 'active'
              : 'inactive'
          }
          onChange={handleStatusChange}
          label="Status"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Roles</InputLabel>
        <Select
          multiple
          value={localFilters.roleIds || []}
          onChange={handleRolesChange}
          label="Roles"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const role = roles.find((r) => r.id === value);
                return <Chip key={value} label={role?.name || value} size="small" />;
              })}
            </Box>
          )}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Button
          variant="outlined"
          size="small"
          onClick={handleClearFilters}
          startIcon={<ClearIcon />}
        >
          Clear Filters
        </Button>
      )}
    </Stack>
  );
};

export default UserFiltersComponent;