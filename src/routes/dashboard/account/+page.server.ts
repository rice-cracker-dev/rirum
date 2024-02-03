import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import { validateUsername } from '$lib/validations';
import { signOutAllSessions, signOutSession } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';

export const actions: Actions = {
  changeUsername: async (event) => {
    if (!event.locals.user) {
      return fail(400, { message: 'You must be signed in to change your username.' });
    }

    const formData = await event.request.formData();
    const username = formData.get('username') as string;

    const [usernameIsValid, usernameReason] = validateUsername(username);
    if (!usernameIsValid) {
      return fail(400, { message: usernameReason });
    }

    try {
      await prisma.user.update({ where: { id: event.locals.user.id }, data: { username } });
    } catch (o: unknown) {
      if (o instanceof Prisma.PrismaClientKnownRequestError && o.code === 'P2002') {
        return fail(400, { message: 'Username already taken.' });
      }

      return fail(500, { message: 'An error occurred while updating your username.' });
    }
  },

  signOut: async (event) => {
    if (!event.locals.session) {
      return fail(400, { message: 'You must be signed in to sign out.' });
    }

    const sessionCookie = await signOutSession(event.locals.session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },

  signOutAll: async (event) => {
    if (!event.locals.user) {
      return fail(400, { message: 'You must be signed in to sign out.' });
    }

    const sessionCookie = await signOutAllSessions(event.locals.user.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },
};
