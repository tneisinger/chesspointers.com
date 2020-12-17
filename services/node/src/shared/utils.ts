import { User } from './entity/user';

export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
