// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { PrismaClient } from '@prisma/client';

declare global {
  declare namespace App {
    interface Locals {
      user: import('lucia').User | null;
      session: import('lucia').Session | null;
    }
    interface PageData {
      user: import('lucia').User | null;
    }
    // interface Error {}
    // interface Platform {}
  }

  // for debugging purposes
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient;
}

export {};
