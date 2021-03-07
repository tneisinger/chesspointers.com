import axios from 'axios';
import { Trap } from '../../shared/entity/chessTrap';

export async function fetchTraps(): Promise<Trap[]> {
  const result = await axios.get(`/api/traps`);
  return result.data as Trap[];
}

export async function fetchTrap(trapId: string): Promise<Trap> {
  const result = await axios.get(`/api/traps/${trapId}`);
  return result.data as Trap;
}
