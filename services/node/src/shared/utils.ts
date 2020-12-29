import { User } from './entity/user';

export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length &&
    a.every((val, idx) => val === b[idx]);
}
