import { User, Avatar } from 'cryptomath-api-proto/types/user';

export interface GetUserProfileResponse {
  user: User;
  avatar?: Avatar;
}
