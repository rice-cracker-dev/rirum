<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { page } from '$app/stores';
  import { validatePassword, validateUsername } from '$lib/validations';
  import FormLoadingWrapper from '$lib/components/FormLoadingWrapper.svelte';
  import Icon from '@iconify/svelte';
  import RichTextEditor from '$lib/components/RichTextEditor.svelte';

  export let data: PageData;
  export let form: ActionData;

  let formUsername = $page.data.user?.username;
  let formCurrentPassword = '';
  let formNewPassword = '';

  $: [isUsernameValid, usernameReason] = validateUsername(formUsername);
  $: [isNewPasswordValid, newPasswordReason] = validatePassword(formNewPassword);
</script>

<FormLoadingWrapper let:loading class="max-w-2xl space-y-4">
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

  {#if form && form.form === 'username'}
    {#if form.success}
      <p class="text-success-400-500-token">Username changed successfully.</p>
    {:else}
      <p class="text-error-400-500-token">{form.message}</p>
    {/if}
  {/if}

  <button
    type="submit"
    class="variant-filled-primary btn gap-2"
    formaction="?/changeUsername"
    disabled={!isUsernameValid || formUsername === data.user.username || loading}
  >
    {#if loading}
      <Icon icon="ph:circle-notch" class="animate-spin" />
    {/if}
    Submit
  </button>

  <label class="label">
    <span>Bio</span>
    <textarea name="bio" class="textarea" rows={7} value={data.user.bio} />
  </label>

  <div class="label">
    <span>Signature</span>
    <RichTextEditor name="signature" content={data.user.signature} isInput />
  </div>

  {#if form && form.form === 'bioAndSignature'}
    {#if form.success}
      <p class="text-success-400-500-token">Bio and signature changed successfully.</p>
    {:else}
      <p class="text-error-400-500-token">{form.message}</p>
    {/if}
  {/if}

  <button
    type="submit"
    class="variant-filled-primary btn gap-2"
    formaction="?/changeBioAndSignature"
    disabled={loading}
  >
    {#if loading}
      <Icon icon="ph:circle-notch" class="animate-spin" />
    {/if}
    Submit
  </button>
</FormLoadingWrapper>

<FormLoadingWrapper class="max-w-2xl space-y-4" let:loading>
  <h2 class="h2">Password</h2>
  <p class="text-surface-600-300-token">Change your password.</p>
  <label class="label">
    <span>Current password</span>
    <input type="password" name="currentPassword" class="input" bind:value={formCurrentPassword} />
  </label>
  <label class="label">
    <span>New password</span>
    <input
      type="text"
      name="newPassword"
      class="input"
      bind:value={formNewPassword}
      class:border-success-400-500-token={isNewPasswordValid}
      class:border-error-400-500-token={!isNewPasswordValid && formNewPassword.length > 0}
    />
    {#if !isNewPasswordValid && formNewPassword.length > 0}
      <p class="text-error-400-500-token text-sm">{newPasswordReason}</p>
    {/if}
  </label>

  {#if form && form.form === 'password'}
    {#if form.success}
      <p class="text-success-400-500-token">Password changed successfully.</p>
    {:else}
      <p class="text-error-400-500-token">{form.message}</p>
    {/if}
  {/if}

  <button
    type="submit"
    class="variant-filled-primary btn"
    formaction="?/changePassword"
    disabled={!isNewPasswordValid || formCurrentPassword.length === 0 || loading}
  >
    {#if loading}
      <Icon icon="ph:circle-notch" class="animate-spin" />
    {/if}
    Submit
  </button>
</FormLoadingWrapper>

<FormLoadingWrapper class="max-w-2xl space-y-4" let:loading>
  <h2 class="h2">Sign out</h2>
  <p class="text-surface-600-300-token">Sign out of your account.</p>
  <div class="space-x-2">
    <button formaction="?/signOut" class="variant-filled-surface btn" disabled={loading}>
      Sign out
    </button>
    <button formaction="?/signOutAll" class="variant-filled-error btn" disabled={loading}>
      Sign out of all accounts
    </button>
  </div>
</FormLoadingWrapper>
