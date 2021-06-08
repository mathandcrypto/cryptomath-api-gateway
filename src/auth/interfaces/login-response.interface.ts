import { RefreshResponse } from './refresh-response.interface';

export interface LoginResponse extends RefreshResponse {
  userId: number;
  email: string;
}
