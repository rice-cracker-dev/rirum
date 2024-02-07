<script lang="ts">
  import type { JSONContent } from '@tiptap/core';
  import RichTextEditor from '$lib/components/RichTextEditor.svelte';
  import RichTextViewer from '$lib/components/RichTextViewer.svelte';

  let editor: RichTextEditor;

  let showUi = true;
  let editable = true;
  let content: JSONContent | null = null;
</script>

<button
  on:click={() => (showUi = !showUi)}
  class="btn {showUi ? 'variant-filled-primary' : 'variant-filled-surface'}"
>
  show ui
</button>

<button
  on:click={() => (editable = !editable)}
  class="btn {editable ? 'variant-filled-primary' : 'variant-filled-surface'}"
>
  editable
</button>

<RichTextEditor {showUi} {editable} on:update={(o) => (content = o.detail.editor.getJSON())} />
<RichTextEditor bind:this={editor} showUi={false} editable={false} />
<RichTextViewer {content} />
