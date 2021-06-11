import { User, Avatar, Profile } from 'cryptomath-api-proto/types/user';

export interface UserProfile {
  user: User;
  avatar?: Avatar;
  profile?: Profile;
}
