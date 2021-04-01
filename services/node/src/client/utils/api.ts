import axios from 'axios';
import { Lesson } from '../../shared/entity/lesson';

export async function fetchTraps(): Promise<Lesson[]> {
  const result = await axios.get(`/api/traps`);
  return result.data as Lesson[];
}

export async function fetchTrap(trapId: string): Promise<Lesson> {
  const result = await axios.get(`/api/traps/${trapId}`);
  return result.data as Lesson;
}

export async function fetchOpenings(): Promise<Lesson[]> {
  const result = await axios.get(`/api/openings`);
  return result.data as Lesson[];
}

export async function fetchOpening(openingId: string): Promise<Lesson> {
  const result = await axios.get(`/api/openings/${openingId}`);
  return result.data as Lesson;
}
