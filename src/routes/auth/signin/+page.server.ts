import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createSession } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { Argon2id } from 'oslo/password';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/');
  }
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();

    const username = formData.get('username');
    const password = formData.get('password');

    if (typeof username !== 'string' || typeof password !== 'string') {
      return fail(400, { success: false, message: 'Invalid username or password.' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return fail(400, { success: false, message: 'Invalid username.' });
    }

    const validPassword = await new Argon2id().verify(user.hashed_password, password);
    if (!validPassword) {
      return fail(400, { success: false, message: 'Invalid password.' });
    }

    const { sessionCookie } = await createSession(user.id);

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },
};
