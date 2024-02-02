<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton';
  import { forunName } from '$lib/constants';
  import Icon from '@iconify/svelte';
</script>

<AppBar background="bg-transparent">
  <svelte:fragment slot="lead">
    <p class="h4 tracking-wide">{forunName}</p>
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <a href="/" rel="noreferrer" class="btn gap-2 hover:variant-soft-surface">
      <Icon icon="ph:house-fill" />
      Home
    </a>
  </svelte:fragment>
</AppBar>
