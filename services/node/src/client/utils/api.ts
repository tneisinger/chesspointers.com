import axios from 'axios';
import { Trap } from '../../shared/entity/trap';
import { Opening } from '../../shared/entity/opening';

export async function fetchTraps(): Promise<Trap[]> {
  const result = await axios.get(`/api/traps`);
  return result.data as Trap[];
}

export async function fetchTrap(trapId: string): Promise<Trap> {
  const result = await axios.get(`/api/traps/${trapId}`);
  return result.data as Trap;
}

export async function fetchOpenings(): Promise<Opening[]> {
  const result = await axios.get(`/api/openings`);
  return result.data as Opening[];
}

export async function fetchOpening(openingId: string): Promise<Opening> {
  const result = await axios.get(`/api/openings/${openingId}`);
  return result.data as Opening;
}
