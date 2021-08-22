export enum RegisterExceptionError {
  CaptchaTokenExpired = 'captcha_token_expired',
  CaptchaTokenMalformed = 'captcha_token_malformed',
  CaptchaValidateTaskError = 'captcha_validate_task_error',
  CaptchaTaskNotFound = 'captcha_task_not_found',
  CaptchaUnknownError = 'captcha_unknown_error',
  WrongCaptchaAnswer = 'wrong_captcha_answer',
  CreateUserError = 'create_user_error',
  UserNotCreated = 'user_not_created',
  UserAlreadyExists = 'user_already_exists',
  CreateUserUnknownError = 'create_user_unknown_error',
  SentNotifyMailError = 'send_notify_mail_error',
}
