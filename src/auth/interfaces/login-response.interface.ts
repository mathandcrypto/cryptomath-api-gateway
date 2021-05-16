export interface LoginResponse {
  userId: number;
  email: string;
  accessSecret: string;
  refreshSecret: string;
}
