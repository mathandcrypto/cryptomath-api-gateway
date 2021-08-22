export const RegisterException = {
  CaptchaTokenExpired: {
    code: 'captcha_token_expired',
    message: 'Captcha token expired',
  },
  CaptchaTokenMalformed: {
    code: 'captcha_token_malformed',
    message: 'Captcha token malformed',
  },
  CaptchaValidateTaskError: {
    code: 'captcha_validate_task_error',
    message: 'Failed to validate captcha answer',
  },
  CaptchaTaskNotFound: {
    code: 'captcha_task_not_found',
    message: 'Captcha task not found',
  },
  CaptchaUnknownError: {
    code: 'captcha_unknown_error',
    message: 'Unknown captcha validation error',
  },
  WrongCaptchaAnswer: {
    code: 'wrong_captcha_answer',
    message: 'Wrong answer to captcha task',
  },
  CreateUserError: {
    code: 'create_user_error',
    message: 'Failed to create user',
  },
  UserNotCreated: {
    code: 'user_not_created',
    message: 'User not created',
  },
  UserAlreadyExists: {
    code: 'user_already_exists',
    message: 'Failed to sent registration notify mail',
  },
  CreateUserUnknownError: {
    code: 'create_user_unknown_error',
    message: 'Unknown user creation error',
  },
};
