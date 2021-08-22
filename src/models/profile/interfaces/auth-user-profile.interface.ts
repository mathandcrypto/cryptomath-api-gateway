import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { Profile } from '@cryptomath/cryptomath-api-proto/types/user';

export interface AuthUserProfile extends AuthUser {
  profile: Profile | null;
}
