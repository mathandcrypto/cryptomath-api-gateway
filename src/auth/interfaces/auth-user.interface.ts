import { Role } from '@common/enums/role.enum';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  role: Role;
}
