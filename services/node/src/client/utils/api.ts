import axios from 'axios';
import { User } from '../../shared/entity/user';

export async function fetchUsers() {
  const result = await axios.get(`/api/users`);
  return result.data as User[];
}

export async function fetchUser(userId: string) {
  const result = await axios.get(`/api/users/${userId}`);
  return result.data as User;
}
