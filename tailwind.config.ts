import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { theme } from './src/theme';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            code: {
              '&::before': { content: 'none !important' },
              '&::after': { content: 'none !important' },
              '&': { fontWeight: 'normal' },
            },

            p: {
              '&::before': { content: 'none !important' },
              '&::after': { content: 'none !important' },
              '&': { fontWeight: 'normal' },
            },
          },
        },
      },
    },
  },
  plugins: [
    forms,
    typography,
    skeleton({
      themes: {
        custom: [theme],
      },
    }),
  ],
} satisfies Config;
