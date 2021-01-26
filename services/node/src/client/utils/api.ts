import axios from 'axios';
import { ChessTrap } from '../../shared/entity/chessTrap';

export async function fetchChessTraps(): Promise<ChessTrap[]> {
  const result = await axios.get(`/api/traps`);
  return result.data as ChessTrap[];
}

export async function fetchChessTrap(trapId: string): Promise<ChessTrap> {
  const result = await axios.get(`/api/traps/${trapId}`);
  return result.data as ChessTrap;
}
