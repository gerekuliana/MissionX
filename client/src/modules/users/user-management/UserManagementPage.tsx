import React, { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types/user.ts';
import UserForm from '../components/UserForm.tsx';
import ConfirmationDialog from '../../../common/components/ConfirmationDialog.tsx';
import useUserRoles from '../../../common/hooks/useUserRoles';
import { ROLES } from '../../../common/constants/roles';
import { getUsers } from '../userQueries.ts';
import { deleteUser, activateUser, deactivateUser } from '../userMutations.ts';
import { CACHE_TIMES } from '../../../common/constants/cacheTimes.ts';
import { useUserManagementStore } from '../stores/userManagementStore';
import { USER_QUERY_KEYS } from '../userQueryKeys.ts';
import { getTenants } from '../../tenants/tenantQueries.ts';

type UserManagementPageProps = Record<string, unknown>;

const formatRoles = (roles: User['roles']): React.ReactNode => {
  if (!roles || roles.length === 0) {
    return '-';
  }
  return (
    <Stack direction="row" spacing={1}>
      {roles.map((role) => (
        <Chip key={role.id} label={role.name} size="small" />
      ))}
    </Stack>
  );
};

const UserManagementPage: React.FC<UserManagementPageProps> = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const userRoles = useUserRoles();
  const isSuperAdmin = userRoles.includes(ROLES.SUPER_ADMIN);

  const {
    isFormOpen,
    selectedUser,
    isConfirmDeleteDialogOpen,
    userToDeleteId,
    isConfirmToggleStatusDialogOpen,
    userToToggleStatus,
    nameFilter,
    tenantFilter,
    openCreateForm,
    openEditForm,
    closeForm,
    openConfirmDeleteDialog,
    closeConfirmDeleteDialog,
    resetDeleteState,
    openConfirmToggleStatusDialog,
    closeConfirmToggleStatusDialog,
    resetToggleStatusState,
    setNameFilter,
    setTenantFilter,
    clearFilters,
  } = useUserManagementStore();

  const { data: tenantsData } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
    enabled: isSuperAdmin,
    staleTime: CACHE_TIMES.DEFAULT,
  });
  const tenants = useMemo(() => tenantsData?.data ?? [], [tenantsData]);

  const {
    data: usersData,
    isLoading,
    error: usersError,
  } = useQuery({
    queryKey: [USER_QUERY_KEYS.GET_USERS, nameFilter, tenantFilter],
    queryFn: () => getUsers({ name: nameFilter, tenantId: tenantFilter }),
    staleTime: CACHE_TIMES.DEFAULT,
  });

  useEffect(() => {
    if (usersError) {
      enqueueSnackbar(usersError.message || 'An error occurred while fetching data', {
        variant: 'error',
      });
    }
  }, [usersError, enqueueSnackbar]);

  const users = useMemo(() => usersData?.data ?? [], [usersData]);

  const hasActiveFilters = nameFilter || tenantFilter;

  const { mutateAsync: removeUserMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.GET_USERS] });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message || 'Failed to delete user', {
        variant: 'error',
      });
    },
    onSettled: () => resetDeleteState(),
  });

  const { mutateAsync: toggleUserStatusMutate, isPending: isTogglingStatus } = useMutation({
    mutationFn: (variables: { id: string; activate: boolean }) =>
      variables.activate ? activateUser(variables.id) : deactivateUser(variables.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEYS.GET_USERS] });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message || 'Failed to update user status', {
        variant: 'error',
      });
    },
    onSettled: () => resetToggleStatusState(),
  });

  const handleConfirmDelete = async (): Promise<void> => {
    if (userToDeleteId === null) return;

    await removeUserMutate(userToDeleteId);
  };

  const handleConfirmToggleStatus = async (): Promise<void> => {
    if (!userToToggleStatus) return;

    const activate = !userToToggleStatus.isActive;
    await toggleUserStatusMutate({ id: userToToggleStatus.id, activate });
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';

    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          overflow: 'hidden',
        }}>
        <CardHeader
          title={
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              User Management
            </Typography>
          }
          action={
            <Button
              variant="contained"
              onClick={openCreateForm}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.primary.dark },
              }}>
              + Add User
            </Button>
          }
        />
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          )}
          {!isLoading && (
            <TableContainer>
              <Table stickyHeader aria-label="user table">
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.text.secondary,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      },
                    }}>
                    <TableCell>Email</TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography variant="body2">Name</Typography>
                        <TextField
                          size="small"
                          placeholder="Filter by name"
                          value={nameFilter}
                          onChange={(e) => setNameFilter(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                              </InputAdornment>
                            ),
                            endAdornment: nameFilter && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => setNameFilter('')}
                                  edge="end">
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: {
                              backgroundColor: theme.palette.background.default,
                            },
                          }}
                          sx={{ minWidth: 180 }}
                        />
                      </Stack>
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell>
                        <Stack spacing={1}>
                          <Typography variant="body2">Tenant</Typography>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={tenantFilter}
                              onChange={(e: SelectChangeEvent) =>
                                setTenantFilter(e.target.value)
                              }
                              displayEmpty
                              sx={{
                                backgroundColor: theme.palette.background.default,
                              }}>
                              <MenuItem value="">All Tenants</MenuItem>
                              {tenants.map((tenant) => (
                                <MenuItem key={tenant.id} value={tenant.id}>
                                  {tenant.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </TableCell>
                    )}
                    <TableCell>Roles</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right">
                      {hasActiveFilters && (
                        <Button
                          size="small"
                          onClick={clearFilters}
                          startIcon={<ClearIcon />}
                          sx={{ mb: 1 }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '& tr': {
                      '&:hover': {},
                    },
                    '& td, & th': {
                      color: theme.palette.text.primary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 1,
                    },
                    '& tr:last-child td, & tr:last-child th': {
                      borderBottom: 0,
                    },
                  }}>
                  {users.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={isSuperAdmin ? 7 : 6} align="center" sx={{ py: 3 }}>
                        {hasActiveFilters ? 'No users match the current filters.' : 'No users found.'}
                      </TableCell>
                    </TableRow>
                  )}
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell component="th" scope="row">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {`${user.firstName ?? '-'} ${user.lastName ?? ''}`.trim()}
                      </TableCell>
                      {isSuperAdmin && <TableCell>{user.tenant?.name ?? 'N/A'}</TableCell>}
                      <TableCell>{formatRoles(user.roles)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={user.isActive ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={user.isActive ? 'Deactivate User' : 'Activate User'}>
                          <IconButton
                            onClick={() => openConfirmToggleStatusDialog(user)}
                            size="small"
                            color={user.isActive ? 'warning' : 'success'}
                            sx={{ mr: 0.5 }}
                            disabled={isTogglingStatus && userToToggleStatus?.id === user.id}>
                            {user.isActive ? <HighlightOffIcon /> : <CheckCircleOutlineIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton
                            onClick={() => openEditForm(user)}
                            size="small"
                            color="primary"
                            sx={{ mr: 0.5 }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            onClick={() => openConfirmDeleteDialog(user.id)}
                            size="small"
                            color="error"
                            disabled={isDeleting && userToDeleteId === user.id}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isFormOpen}
        onClose={closeForm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}>
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          {selectedUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <UserForm user={selectedUser} onClose={closeForm} />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onClose={closeConfirmDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user #${userToDeleteId}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonProps={{ color: 'error', disabled: isDeleting }}
      />

      <ConfirmationDialog
        open={isConfirmToggleStatusDialogOpen}
        onClose={closeConfirmToggleStatusDialog}
        onConfirm={handleConfirmToggleStatus}
        title={userToToggleStatus?.isActive ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${userToToggleStatus?.isActive ? 'deactivate' : 'activate'} user ${userToToggleStatus?.email ?? ''}?`}
        confirmText={userToToggleStatus?.isActive ? 'Deactivate' : 'Activate'}
        confirmButtonProps={{
          color: userToToggleStatus?.isActive ? 'warning' : 'success',
          disabled: isTogglingStatus,
        }}
      />
    </Box>
  );
};

export default UserManagementPage;
