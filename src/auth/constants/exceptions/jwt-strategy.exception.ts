export const JwtStrategyException = {
  ValidateAccessSessionError: {
    code: 'validate_access_session_error',
    message: 'Failed to validate access session',
  },
  AccessSessionNotExists: {
    code: 'access_session_not_exists',
    message: 'Access session with this user id and secret was not found',
  },
  AccessSessionExpired: {
    code: 'access_session_expired',
    message: 'Access session expired',
  },
  FindUserError: {
    code: 'find_user_error',
    message: 'Failed to find user',
  },
  UserNotExists: {
    code: 'user_not_exists',
    message: 'User with this id does not exist',
  },
}