import { User } from './entity/user';

export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

export function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length &&
    a.every((val, idx) => val === b[idx]);
}

export function getArrayDiff<T>(setA: T[], setB: T[]): T[] {
  return setA.filter((a) => !setB.includes(a));
}

export function partition<T>(array: T[], isValid: (t: T) => boolean): T[][] {
  return array.reduce(([pass, fail], elem) => {
    return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
  }, [[], []]);
}

export function randomElem<T>(array: T[]): (T | undefined) {
  return array[Math.floor(Math.random() * array.length)];
}
