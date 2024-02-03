<script lang="ts">
  import { AppShell } from '@skeletonlabs/skeleton';

  // fonts
  import '@fontsource-variable/inter';
  import '@fontsource-variable/outfit';

  // styles
  import '../app.scss';

  // Highlight JS
  import hljs from 'highlight.js/lib/core';
  import 'highlight.js/styles/github-dark.css';
  import { storeHighlightJs } from '@skeletonlabs/skeleton';
  import xml from 'highlight.js/lib/languages/xml'; // for HTML
  import css from 'highlight.js/lib/languages/css';
  import javascript from 'highlight.js/lib/languages/javascript';
  import typescript from 'highlight.js/lib/languages/typescript';

  hljs.registerLanguage('xml', xml); // for HTML
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('typescript', typescript);
  storeHighlightJs.set(hljs);

  // Floating UI for Popups
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  import Navbar from '$lib/components/Navbar.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <Navbar />
  </svelte:fragment>
  <!-- Page Route Content -->
  <div class="container mx-auto mt-16 flex gap-32">
    <Sidebar />

    <div class="flex-1">
      <slot />
    </div>
  </div>
</AppShell>
