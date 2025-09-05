import { create } from 'zustand';
import { User } from '../types/user';

export type StatusFilter = 'all' | 'active' | 'inactive';

interface UserManagementState {
  isFormOpen: boolean;
  selectedUser: User | null;
  isConfirmDeleteDialogOpen: boolean;
  userToDeleteId: string | null;
  isConfirmToggleStatusDialogOpen: boolean;
  userToToggleStatus: User | null;

  // Filter states
  emailFilter: string;
  roleFilter: string;
  statusFilter: StatusFilter;

  openCreateForm: () => void;
  openEditForm: (user: User) => void;
  closeForm: () => void;

  openConfirmDeleteDialog: (id: string) => void;
  closeConfirmDeleteDialog: () => void;
  resetDeleteState: () => void;

  openConfirmToggleStatusDialog: (user: User) => void;
  closeConfirmToggleStatusDialog: () => void;
  resetToggleStatusState: () => void;

  // Filter actions
  setEmailFilter: (email: string) => void;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  clearFilters: () => void;
}

export const useUserManagementStore = create<UserManagementState>((set) => ({
  // Initial state
  isFormOpen: false,
  selectedUser: null,
  isConfirmDeleteDialogOpen: false,
  userToDeleteId: null,
  isConfirmToggleStatusDialogOpen: false,
  userToToggleStatus: null,

  // Filter initial states
  emailFilter: '',
  roleFilter: '',
  statusFilter: 'all',

  openCreateForm: (): void => set({ isFormOpen: true, selectedUser: null }),
  openEditForm: (user: User): void => set({ isFormOpen: true, selectedUser: user }),
  closeForm: (): void => set({ isFormOpen: false, selectedUser: null }),

  openConfirmDeleteDialog: (id: string): void =>
    set({ isConfirmDeleteDialogOpen: true, userToDeleteId: id }),
  closeConfirmDeleteDialog: (): void =>
    set({ isConfirmDeleteDialogOpen: false, userToDeleteId: null }),
  resetDeleteState: (): void => set({ isConfirmDeleteDialogOpen: false, userToDeleteId: null }),

  openConfirmToggleStatusDialog: (user: User): void =>
    set({ isConfirmToggleStatusDialogOpen: true, userToToggleStatus: user }),
  closeConfirmToggleStatusDialog: (): void =>
    set({ isConfirmToggleStatusDialogOpen: false, userToToggleStatus: null }),
  resetToggleStatusState: (): void =>
    set({ isConfirmToggleStatusDialogOpen: false, userToToggleStatus: null }),

  // Filter actions
  setEmailFilter: (email: string): void => set({ emailFilter: email }),
  setRoleFilter: (role: string): void => set({ roleFilter: role }),
  setStatusFilter: (status: StatusFilter): void => set({ statusFilter: status }),
  clearFilters: (): void =>
    set({ emailFilter: '', roleFilter: '', statusFilter: 'all' }),
}));
