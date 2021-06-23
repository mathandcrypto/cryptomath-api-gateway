import { Role } from '@common/enums/role.enum';
import { Avatar } from './avatar.interface';

export interface User {
  id: number;
  display_name: string;
  role: Role;
  reputation: number;
  avatar: Avatar | null;
  created_at: Date;
}
