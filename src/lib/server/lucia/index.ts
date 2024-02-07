import type { JSONContent } from '@tiptap/core';
import { generateId, Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';
import { Argon2id } from 'oslo/password';

const adapter = new PrismaAdapter(prisma.session, prisma.user); // your adapter

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: !dev,
    },
  },

  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      bio: attributes.bio,
      signature: attributes.signature,
    };
  },
});

export const createSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return { session, sessionCookie };
};

export const createUser = async (username: string, password: string) => {
  const userId = generateId(15);
  const hashedPassword = await new Argon2id().hash(password);

  await prisma.user.create({
    data: {
      id: userId,
      username,
      hashed_password: hashedPassword,
    },
  });

  return userId;
};

export const createUserAndSession = async (username: string, password: string) => {
  const id = await createUser(username, password);
  const { session, sessionCookie } = await createSession(id);

  return { id, session, sessionCookie };
};

export const signOutSession = async (sessionId: string) => {
  await lucia.invalidateSession(sessionId);
  return lucia.createBlankSessionCookie();
};

export const signOutAllSessions = async (userId: string) => {
  await lucia.invalidateUserSessions(userId);
  return lucia.createBlankSessionCookie();
};

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  bio: string;
  signature?: JSONContent;
}
