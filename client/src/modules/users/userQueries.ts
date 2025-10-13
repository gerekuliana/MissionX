import axios from 'axios';
import { User } from './types/user';

export const getUsers = (params: { name?: string; tenantId?: string } = {}) =>
  axios.get<User[]>('/users', { params });
export const getUserById = (id: string) => axios.get<User>(`/users/${id}`);
