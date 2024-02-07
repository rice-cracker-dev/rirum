<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { validatePassword, validateUsername } from '$lib/validations';

  export let form: ActionData;

  let formUsername = '';
  let formPassword = '';
  let formIsRequiredAge = false;
  let formIsTosAccepted = false;

  $: [isUsernameValid, usernameReason] = validateUsername(formUsername);
  $: [isPasswordValid, passwordReason] = validatePassword(formPassword);
</script>

<div class="space-y-2">
  <h2 class="h2">Sign up</h2>
  <p class="text-surface-600-300-token">
    Or
    <a href="/auth/signin" class="anchor">sign in</a> if you already have an account.
  </p>
</div>

<form method="post" class="mt-8 max-w-md space-y-4" use:enhance>
  <label class="label">
    <span>Username</span>
    <input
      type="text"
      name="username"
      class="input"
      class:border-success-400-500-token={isUsernameValid}
      class:border-error-400-500-token={!isUsernameValid && formUsername.length > 0}
      bind:value={formUsername}
    />
    {#if !isUsernameValid && formUsername.length > 0}
      <p class="text-error-400-500-token text-sm">{usernameReason}</p>
    {/if}
  </label>
  <label class="label">
    <span>Password</span>
    <input
      type="password"
      name="password"
      class="input"
      class:border-success-400-500-token={isPasswordValid}
      class:border-error-400-500-token={!isPasswordValid && formPassword.length > 0}
      bind:value={formPassword}
    />
    {#if !isPasswordValid && formPassword.length > 0}
      <p class="text-error-400-500-token text-sm">{passwordReason}</p>
    {/if}
  </label>

  <label class="flex items-center gap-2">
    <input type="checkbox" name="age" class="checkbox" bind:value={formIsRequiredAge} />
    <span class="text-surface-600-300-token">I am over 13 years old.</span>
  </label>

  <label class="flex items-center gap-2">
    <input type="checkbox" name="terms" class="checkbox" bind:value={formIsTosAccepted} />
    <span class="text-surface-600-300-token">
      I agree to the <a href="/legal/tos" class="anchor">terms of service</a> of this website.
    </span>
  </label>

  {#if form && !form.success}
    <p class="text-error-400-500-token">{form.message}</p>
  {/if}

  <button
    type="submit"
    class="variant-filled-primary btn"
    disabled={!isUsernameValid || !isPasswordValid || !formIsRequiredAge || !formIsTosAccepted}
  >
    Sign up
  </button>
</form>
