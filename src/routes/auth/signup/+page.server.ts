import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { validatePassword, validateUsername } from '$lib/validations';

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const [isUsernameValid, usernameReason] = validateUsername(username);
    if (!isUsernameValid) {
      return fail(400, { message: usernameReason });
    }

    const [isPasswordValid, passwordReason] = validatePassword(password);
    if (!isPasswordValid) {
      return fail(400, { message: passwordReason });
    }

    const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(password);
  },
};
