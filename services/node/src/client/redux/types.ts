import { RequestStatus } from '../types/general';

export interface SliceState {
  error: string | null;
  requestStatus: RequestStatus;
}
