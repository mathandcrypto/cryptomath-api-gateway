export interface AuthResolveRefreshToken {
  userId: number;
  email: string;
  refreshSecret: string;
}
