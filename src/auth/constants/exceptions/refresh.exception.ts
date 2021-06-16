export const RefreshException = {
  RefreshTokenExpired: {
    code: 'refresh_token_expired',
    message: 'Refresh token expired',
  },
  RefreshTokenMalformed: {
    code: 'refresh_token_malformed',
    message: 'Refresh token malformed',
  },
  ValidateRefreshSessionError: {
    code: 'validate_refresh_session_error',
    message: 'Failed to validate refresh session',
  },
  RefreshSessionNotExists: {
    code: 'refresh_session_not_exists',
    message: 'Refresh session does not exist',
  },
  RefreshSessionExpired: {
    code: 'refresh_session_expired',
    message: 'Refresh session expired',
  },
  ResolveRefreshTokenUnknownError: {
    code: 'resolve_refresh_token_unknown_error',
    message: 'Failed to resolve refresh token',
  },
  DeleteRefreshSessionError: {
    code: 'delete_refresh_session_error',
    message: 'Failed to delete refresh session',
  },
  RefreshSessionNotDeleted: {
    code: 'refresh_session_not_deleted',
    message: 'Refresh session not deleted',
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
  RefreshSessionUnknownError: {
    code: 'refresh_session_unknown_error',
    message: 'Failed to refresh auth sessions',
  },
};
