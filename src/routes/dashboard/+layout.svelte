<script lang="ts">
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';

  type DashboardLink = {
    label: string;
    href: string;
    icon: string;
  };

  const links: DashboardLink[] = [{ label: 'Account', href: 'account', icon: 'ph:user' }];
</script>

<div>
  {#each links as link}
    <button
      class="btn {`/dashboard/${link.href}` === $page.url.pathname
        ? 'variant-filled-primary'
        : 'hover:variant-filled-surface'}"
    >
      <Icon icon={link.icon} />
      <span>{link.label}</span>
    </button>
  {/each}
</div>

<div class="mt-16 space-y-16">
  <slot />
</div>
