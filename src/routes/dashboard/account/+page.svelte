<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { validateUsername } from '$lib/validations';

  export let data: PageData;

  let formUsername = $page.data.user.username;
  let [isUsernameValid, usernameReason] = [false, null];

  $: {
    [isUsernameValid, usernameReason] = validateUsername(formUsername);
  }
</script>

<form method="post" use:enhance class="max-w-lg space-y-4">
  <h2 class="h2">Account info</h2>
  <p class="text-surface-600-300-token">Change your account information</p>
  <label class="label">
    <span>Username</span>
    <input
      type="text"
      name="username"
      class="input"
      bind:value={formUsername}
      class:border-success-400-500-token={isUsernameValid && formUsername !== data.user.username}
      class:border-error-400-500-token={!isUsernameValid}
    />
    {#if !isUsernameValid}
      <p class="text-error-400-500-token text-sm">{usernameReason}</p>
    {/if}
  </label>
  <button
    type="submit"
    class="variant-filled-primary btn"
    formaction="?/changeUsername"
    disabled={!isUsernameValid || formUsername === data.user.username}
  >
    Submit
  </button>
</form>

<form class="space-y-4" method="post" use:enhance>
  <h2 class="h2">Sign out</h2>
  <p class="text-surface-600-300-token">Sign out of your account.</p>
  <div class="space-x-2">
    <button formaction="?/signOut" class="variant-filled-surface btn">Sign out</button>
    <button formaction="?/signOutAll" class="variant-filled-error btn">
      Sign out of all accounts
    </button>
  </div>
</form>
