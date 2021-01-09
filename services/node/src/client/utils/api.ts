import axios from 'axios';
import { ChessTrap } from '../../shared/entity/chessTrap';

export async function fetchChessTraps() {
  const result = await axios.get(`/api/traps`);
  return result.data as ChessTrap[];
}

export async function fetchChessTrap(trapId: string) {
  const result = await axios.get(`/api/traps/${trapId}`);
  return result.data as ChessTrap;
}
