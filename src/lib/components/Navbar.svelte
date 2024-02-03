<script lang="ts">
  import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
  import { forunName } from '$lib/constants';
  import Icon from '@iconify/svelte';
</script>

<AppBar padding="px-16 py-8" background="bg-transparent">
  <svelte:fragment slot="lead">
    <p class="h4 tracking-wide">{forunName}</p>
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <a href="/" rel="noreferrer" class="btn gap-2 hover:variant-soft-surface">
      <Icon icon="ph:house-fill" />
      Home
    </a>

    <a href="/auth/signin" class="variant-filled-surface btn">Sign in</a>
    <a href="/auth/signup" class="variant-filled-primary btn">Sign up</a>

    <LightSwitch />
  </svelte:fragment>
</AppBar>
