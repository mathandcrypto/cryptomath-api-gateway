export const SaveAvatarException = {
  InvalidObjectKey: {
    code: 'invalid_object_key',
    message: 'Invalid object key',
  },
  InvalidObjectUser: {
    code: 'invalid_object_user',
    message: 'Invalid object user',
  },
  SaveToStorageError: {
    code: 'save_to_storage_error',
    message: 'Error saving avatar to storage',
  },
  UnknownErrorSavingToStorage: {
    code: 'unknown_error_saving_to_storage',
    message: 'Unknown error saving avatar to storage',
  },
  FindAvatarError: {
    code: 'find_avatar_error',
    message: 'Failed to find user avatar',
  },
  ErrorDeletingOldAvatar: {
    code: 'error_deleting_old_avatar',
    message: 'Failed to delete old avatar',
  },
  ErrorRemovingOldAvatarFromStorage: {
    code: 'error_removing_old_avatar_from_storage',
    message: 'Failed to remove old avatar from storage',
  },
  CreateAvatarError: {
    code: 'create_avatar_error',
    message: 'Failed to create avatar',
  },
  AvatarNotCreated: {
    code: 'avatar_not_created',
    message: 'Avatar not created',
  },
  UnknownCreateAvatarError: {
    code: 'unknown_create_avatar_error',
    message: 'Unknown error creating user avatar',
  },
};
