import { AuthUser } from './auth-user.interface';
import { Avatar } from 'cryptomath-api-proto/types/user';

export interface AuthUserExtra extends AuthUser {
  avatar?: Avatar;
}
