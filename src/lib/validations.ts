export const validateUsername = (username: unknown): [boolean, string | null] => {
  if (typeof username !== 'string') {
    return [false, 'Username must be a string.'];
  }

  if (username.length < 4 || username.length > 32) {
    return [false, 'Username must be between 4 and 32 characters.'];
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return [false, 'Username must only contain letters, numbers, underscores, and hyphens.'];
  }

  return [true, null];
};

export const validatePassword = (password: unknown): [boolean, string | null] => {
  if (typeof password !== 'string') {
    return [false, 'Password must be a string.'];
  }

  if (password.length < 8) {
    return [false, 'Password must be at least 8 characters.'];
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/.test(password)) {
    return [
      false,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
    ];
  }

  return [true, null];
};
