import { Role } from '@common/enums/role.enum';
import { Avatar } from '@models/users/interfaces/avatar.interface';

export interface AuthUser {
  id: number;
  email: string;
  display_name: string;
  role: Role;
  reputation: number;
  avatar: Avatar | null;
  created_at: Date;
}
