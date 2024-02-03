<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  export let form: ActionData;

  let formUsername = '';
  let formPassword = '';
</script>

<div class="space-y-4">
  <h2 class="h2">Sign in</h2>
  <p class="text-surface-600-300-token">
    Or
    <a href="/auth/signup" class="anchor">sign up</a> if you don't have an account.
  </p>
</div>

<form method="post" class="mt-8 max-w-md space-y-4" use:enhance>
  <label class="label">
    <span>Username</span>
    <input type="text" name="username" class="input" bind:value={formUsername} />
  </label>
  <label class="label">
    <span>Password</span>
    <input type="password" name="password" class="input" bind:value={formPassword} />
  </label>

  {#if form && !form.success}
    <p class="text-error-400-500-token">{form.message}</p>
  {/if}

  <button
    type="submit"
    class="variant-filled-primary btn"
    disabled={formUsername.length === 0 || formPassword.length === 0}
  >
    Sign in
  </button>
</form>
