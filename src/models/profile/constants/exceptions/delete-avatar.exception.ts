export const DeleteAvatarException = {
  ErrorDeletingAvatar: {
    code: 'error_deleting_avatar',
    message: 'Error deleting user avatar',
  },
  AvatarNotDeleted: {
    code: 'avatar_not_deleted',
    message: 'Avatar not deleted',
  },
  ErrorRemovingOldAvatarFromStorage: {
    code: 'error_removing_old_avatar_from_storage',
    message: 'Failed to remove old avatar from storage',
  },
  UnknownDeleteAvatarError: {
    code: 'unknown_delete_avatar_error',
    message: 'Unknown error deleting user avatar',
  },
};
