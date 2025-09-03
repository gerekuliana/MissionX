import axios from 'axios';
import { User } from './types/user';

export interface UserFilters {
  email?: string;
  name?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export const getUsers = (filters?: UserFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.email) params.append('email', filters.email);
  if (filters?.name) params.append('name', filters.name);
  if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
  if (filters?.roleIds && filters.roleIds.length > 0) {
    filters.roleIds.forEach(id => params.append('roleIds', id));
  }

  return axios.get<User[]>('/users', { params });
};

export const getUserById = (id: string) => axios.get<User>(`/users/${id}`);
