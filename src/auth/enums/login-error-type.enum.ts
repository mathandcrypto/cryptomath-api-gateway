export enum LoginErrorType {
  FindUserError = 'find_user_error',
  UserNotExists = 'user_not_exists',
  InvalidPassword = 'invalid_password',
  CreateAccessSessionError = 'create_access_session_error',
  AccessSessionNotCreated = 'access_session_not_created',
  RefreshSessionNotCreated = 'refresh_session_not_created',
}
