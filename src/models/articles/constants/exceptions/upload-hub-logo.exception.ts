export const UploadHubLogoException = {
  InvalidImageFile: {
    code: 'invalid_image_file',
    message: 'Invalid image file. Allowed .jpeg or .png extensions',
  },
  InvalidImageFileSize: {
    code: 'invalid_image_file_size',
    message: 'Invalid image file size. The size is allowed up to 500 kb.',
  },
  InvalidImageSize: {
    code: 'invalid_image_size',
    message:
      'Invalid image size. The minimum length and width should be 200 pixels.',
  },
  SaveTempFileError: {
    code: 'save_temp_file_error',
    message: 'Error saving a temporary file',
  },
  UploadFileError: {
    code: 'upload_file_error',
    message: 'Upload file error',
  },
  UnknownFileUploadError: {
    code: 'unknown_file_upload_error',
    message: 'Unknown upload file error',
  },
};
