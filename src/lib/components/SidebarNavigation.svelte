<script lang="ts">
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';

  type SidebarLink = {
    label: string;
    href: string;
    icon: string;
  };

  const links: SidebarLink[] = [{ label: 'Home', href: '/', icon: 'ph:house-fill' }];
</script>

<div class="space-y-2">
  <h6 class="h6">Navigation</h6>
  <div class="card variant-filled-surface flex flex-col p-2">
    {#each links as link}
      <a
        href={link.href}
        class="btn btn-sm justify-start gap-2 {link.href === $page.url.pathname
          ? 'variant-filled-primary'
          : 'hover:variant-filled-surface'}"
      >
        <Icon icon={link.icon} />
        {link.label}
      </a>
    {/each}
  </div>
</div>
