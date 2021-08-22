import { AuthRefresh } from './refresh.interface';

export interface AuthLogin extends AuthRefresh {
  userId: number;
  email: string;
}
