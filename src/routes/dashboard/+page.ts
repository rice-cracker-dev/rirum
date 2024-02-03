import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = () => {
  redirect(302, '/dashboard/account');
};
