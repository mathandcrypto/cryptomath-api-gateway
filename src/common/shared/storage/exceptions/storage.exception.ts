import { StorageError } from '../enums/storage-error.enum';

export class StorageException extends Error {
  private readonly code: StorageError;

  constructor(message?: string, code?: StorageError) {
    super(`Storage Exception: ${message}`);

    this.code = code;
  }
}
