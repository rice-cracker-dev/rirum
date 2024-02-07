import type { Actions, PageServerLoad } from './$types';
import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { validatePassword, validateUsername } from '$lib/validations';
import { createUserAndSession } from '$lib/server/lucia';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/');
  }
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const [isUsernameValid, usernameReason] = validateUsername(username);
    if (!isUsernameValid) {
      return fail(400, { success: false, message: usernameReason });
    }

    const [isPasswordValid, passwordReason] = validatePassword(password);
    if (!isPasswordValid) {
      return fail(400, { success: false, message: passwordReason });
    }

    try {
      const { sessionCookie } = await createUserAndSession(username, password);

      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      });
    } catch (o: unknown) {
      console.error(o);

      if (o instanceof Prisma.PrismaClientKnownRequestError) {
        switch (o.code) {
          case 'P2002':
            return fail(400, { success: false, message: 'Username already taken.' });
        }
      }

      return fail(500, {
        success: false,
        message: 'An error occurred while creating your account.',
      });
    }

    redirect(302, '/');
  },
};
