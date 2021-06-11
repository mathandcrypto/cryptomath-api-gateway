import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { Avatar, Profile } from 'cryptomath-api-proto/types/user';

export interface AuthUserProfile extends AuthUser {
  avatar?: Avatar;
  profile?: Profile;
}