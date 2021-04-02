import { RequestStatus } from '../types/general';

export interface SliceState {
  error: string | null;
  requestStatus: RequestStatus;
}

export interface Entities<E> {
  entities: E[];
}

export type EntitiesSlice<E> = SliceState & Entities<E>;
