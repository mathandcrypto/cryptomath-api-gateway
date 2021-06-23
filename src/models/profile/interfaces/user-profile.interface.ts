import { User, Profile } from 'cryptomath-api-proto/types/user';

export interface UserProfile extends User {
  profile: Profile | null;
}
