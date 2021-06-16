export const LoginException = {
  FindUserError: {
    code: 'find_user_error',
    message: 'Failed to find user',
  },
  UserNotExists: {
    code: 'user_not_exists',
    message: 'User with this email was not found',
  },
  InvalidPassword: {
    code: 'invalid_password',
    message: 'Invalid user password',
  },
  CreateAccessSessionError: {
    code: 'create_access_session_error',
    message: 'Failed to create access session',
  },
  AccessSessionNotCreated: {
    code: 'access_session_not_created',
    message: 'Access session not created',
  },
  RefreshSessionNotCreated: {
    code: 'refresh_session_not_created',
    message: 'Refresh session not created',
  },
  LoginUnknownError: {
    code: 'login_unknown_error',
    message: 'Authorization error',
  },
};
