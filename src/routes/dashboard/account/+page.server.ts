import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import { validatePassword, validateUsername } from '$lib/validations';
import { signOutAllSessions, signOutSession } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { Argon2id } from 'oslo/password';

export const actions: Actions = {
  changeUsername: async (event) => {
    if (!event.locals.user) {
      return fail(400, {
        form: 'username',
        message: 'You must be signed in to change your username.',
      });
    }

    const formData = await event.request.formData();
    const username = formData.get('username') as string;

    const [usernameIsValid, usernameReason] = validateUsername(username);
    if (!usernameIsValid) {
      return fail(400, { form: 'username', message: usernameReason });
    }

    try {
      await prisma.user.update({ where: { id: event.locals.user.id }, data: { username } });
    } catch (o: unknown) {
      if (o instanceof Prisma.PrismaClientKnownRequestError && o.code === 'P2002') {
        return fail(400, { form: 'username', message: 'Username is already taken.' });
      }

      return fail(500, {
        form: 'username',
        message: 'An error occurred while updating your username.',
      });
    }

    return { form: 'username', success: true };
  },

  changeBioAndSignature: async (event) => {
    if (!event.locals.user) {
      return fail(400, {
        form: 'bioAndSignature',
        message: 'You must be signed in to change your bio and signature.',
      });
    }

    const formData = await event.request.formData();
    const bio = formData.get('bio') as string;
    const signature = formData.get('signature') as string;

    try {
      await prisma.user.update({
        where: { id: event.locals.user.id },
        data: { bio, signature: JSON.parse(signature) },
      });
    } catch (o: unknown) {
      console.error(o);

      if (o instanceof Prisma.PrismaClientKnownRequestError && o.code === 'P2002') {
        return fail(400, {
          form: 'bioAndSignature',
          message: 'Bio and signature is already taken.',
        });
      }

      return fail(500, {
        form: 'bioAndSignature',
        message: 'An error occurred while updating your bio and signature.',
      });
    }

    return { form: 'bioAndSignature', success: true };
  },

  changePassword: async (event) => {
    if (!event.locals.user) {
      return fail(400, {
        form: 'password',
        message: 'You must be signed in to change your passsord.',
      });
    }

    const formData = await event.request.formData();
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    const [isNewPasswordValid, newPasswordReason] = validatePassword(newPassword);
    if (!isNewPasswordValid) {
      return fail(400, { form: 'password', message: newPasswordReason });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: event.locals.user.id } });
      if (!user) {
        return fail(500, {
          form: 'password',
          message: 'An error occurred while updating your password.',
        });
      }

      const argon2id = new Argon2id();

      const passwordIsValid = await argon2id.verify(user.hashed_password, currentPassword);
      if (!passwordIsValid) {
        return fail(400, { form: 'password', message: 'Current password is incorrect.' });
      }

      await prisma.user.update({
        where: { id: event.locals.user.id },
        data: { hashed_password: await argon2id.hash(newPassword) },
      });
    } catch {
      return fail(500, {
        form: 'password',
        message: 'An error occurred while updating your password.',
      });
    }

    return { form: 'password', success: true };
  },

  signOut: async (event) => {
    if (!event.locals.session) {
      return fail(400, { form: 'signout', message: 'You must be signed in to sign out.' });
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
      return fail(400, { form: 'signout', message: 'You must be signed in to sign out.' });
    }

    const sessionCookie = await signOutAllSessions(event.locals.user.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },
};
