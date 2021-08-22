export const FastifyFileInterceptorException = {
  NotMultipartRequest: {
    code: 'not_multipart_request',
    message: 'Request is not multipart',
  },
  InvalidFieldName: {
    code: 'invalid_field_name',
    message: 'Invalid field name',
  },
  ReachedPartsLimit: {
    code: 'reached_parts_limit',
    message: 'Reached parts limit',
  },
  ReachedFilesLimit: {
    code: 'reached_files_limit',
    message: 'Reached files limit',
  },
  ReachedFieldsLimit: {
    code: 'reached_fields_limit',
    message: 'Reached fields limit',
  },
  FileTooLarge: {
    code: 'file_too_large',
    message: 'File too large',
  },
};
