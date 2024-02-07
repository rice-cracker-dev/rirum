<script lang="ts">
  import { type Content, Editor } from '@tiptap/core';
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import { popup } from '@skeletonlabs/skeleton';
  import {
    RichTextEditorInitialOptions,
    getToolbarCommands,
    type ToolbarCommand,
    colorPalette,
  } from '$lib/components/RichTextEditor';
  import Icon from '@iconify/svelte';
  // import ColorPicker from 'svelte-awesome-color-picker';
  // import ColorPickerWrapper from './ColorPickerWrapper.svelte';
  import './RichTextEditor.scss';

  type ColorDialogSection = {
    name: string;
    label: string;
    icon: string;
  };

  export let name = '';
  export let isInput = false;
  export let editor: Editor | null = null;
  export let showUi = true;
  export let editable = true;
  export let content: Content | null = null;

  const colorDialogSections: ColorDialogSection[] = [
    { name: 'presets', label: 'Presets', icon: 'paint-brush' },
    // { name: 'picker', label: 'Picker', icon: 'eyedropper' }, // TODO: implement color picker.
  ];
  const dispatcher = createEventDispatcher();

  let element: HTMLElement;
  let colorDialogColor = '';
  let colorDialogSectionIndex = 0;

  const getProps = (command: ToolbarCommand) => {
    return {
      class: `btn-icon btn-icon-sm min-w-8 ${
        command.isActive ? 'variant-filled-primary' : 'hover:variant-soft-surface'
      }`,
      style: 'border-radius: var(--theme-rounded-base)',
      disabled: command.canExecute === false,
    };
  };

  const onCodeBlockDialogSubmit = (o: SubmitEvent) => {
    const formData = new FormData(o.target as HTMLFormElement);
    const language = formData.get('language') as string;

    editor?.chain().focus().setCodeBlock({ language }).run();
  };

  const onLinkDialogSubmit = (o: SubmitEvent) => {
    const formData = new FormData(o.target as HTMLFormElement);
    const href = formData.get('href') as string;

    editor?.chain().focus().setLink({ href }).run();
  };

  const onImageDialogSubmit = (o: SubmitEvent) => {
    const formData = new FormData(o.target as HTMLFormElement);
    const src = formData.get('src') as string;
    const alt = formData.get('alt') as string;

    editor?.chain().focus().setImage({ src, alt }).run();
  };

  const onColorDialogSubmit = (o: SubmitEvent) => {
    const formData = new FormData(o.target as HTMLFormElement);
    const color = formData.get('hex') as string;

    editor?.chain().focus().setColor(color).run();

    colorDialogColor = '';
  };

  onMount(() => {
    if (!editor) {
      editor = new Editor({
        ...RichTextEditorInitialOptions,

        element,
        content,
        editable,

        onTransaction: () => {
          // rerender editor on transaction
          editor = editor;
        },

        onUpdate: () => {
          dispatcher('update', { editor });
        },
      });
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  $: editor?.setEditable(editable);
  $: editorJSON = editor ? JSON.stringify(editor.getJSON()) : '';
  $: toolbarCommandGroups = getToolbarCommands(editor);
  $: toolbarDialogCommands = toolbarCommandGroups?.flat().filter((o) => !!o.dialog);
  $: colorDialogCurrentSection = colorDialogSections[colorDialogSectionIndex];
</script>

{#if isInput}
  <input type="text" class="hidden" value={editorJSON} {name} />
{/if}

<div class="flex flex-col items-stretch overflow-hidden {showUi && 'card'}">
  {#if showUi && toolbarCommandGroups}
    <div class="flex items-center gap-2 overflow-x-auto p-2">
      {#each toolbarCommandGroups as commandGroup, commandGroupIndex}
        {#each commandGroup as command}
          <!-- canExecute can also be null (which is intepreted as "can always execute") -->
          {#if command.dialog}
            <button
              {...getProps(command)}
              type="button"
              use:popup={{ ...command.dialog, middleware: { offset: 24 } }}
            >
              <Icon icon={command.icon} />
            </button>
          {:else}
            <button {...getProps(command)} type="button" on:click={command.callback}>
              <Icon icon={command.icon} />
            </button>
          {/if}
        {/each}

        {#if commandGroupIndex < toolbarCommandGroups.length - 1}
          <span class="divider-vertical mx-0 min-h-full self-stretch" />
        {/if}
      {/each}
    </div>

    <hr />
  {/if}

  <div bind:this={element} class:rte-input-show-ui={showUi} />
</div>

{#if toolbarDialogCommands}
  {#each toolbarDialogCommands as command}
    <div class="card variant-filled-surface max-w-[24rem] p-4" data-popup={command.dialog?.target}>
      {#if command.name === 'codeblock'}
        <form class="space-y-4" on:submit|preventDefault={onCodeBlockDialogSubmit}>
          <label class="label">
            <span>Language</span>
            <input type="text" name="language" class="input" />
          </label>
          <div class="flex items-stretch gap-2">
            <button type="submit" class="variant-filled-primary btn w-full flex-1">Submit</button>
            {#if editor?.isActive('codeBlock')}
              <button
                type="button"
                class="variant-filled-error btn-icon"
                style="border-radius: var(--theme-rounded-base)"
                on:click={() => editor?.chain().focus().toggleCodeBlock().run()}
              >
                <Icon icon="ph:trash" />
              </button>
            {/if}
          </div>
        </form>
      {:else if command.name === 'link'}
        <form class="space-y-4" on:submit|preventDefault={onLinkDialogSubmit}>
          <label class="label">
            <span>Link</span>
            <input type="text" name="href" class="input" />
          </label>
          <div class="flex items-stretch gap-2">
            <button type="submit" class="variant-filled-primary btn w-full flex-1">Submit</button>
            {#if editor?.isActive('link')}
              <button
                type="button"
                class="variant-filled-error btn-icon"
                style="border-radius: var(--theme-rounded-base)"
                on:click={() => editor?.chain().focus().unsetLink().run()}
              >
                <Icon icon="ph:trash" />
              </button>
            {/if}
          </div>
        </form>
      {:else if command.name === 'image'}
        <form class="space-y-4" on:submit|preventDefault={onImageDialogSubmit}>
          <label class="label">
            <span>Image link</span>
            <input type="text" name="src" class="input" />
          </label>
          <label class="label">
            <span>Alt text</span>
            <input type="text" name="alt" class="input" />
          </label>
          <div class="flex items-stretch gap-2">
            <button type="submit" class="variant-filled-primary btn w-full flex-1">Submit</button>
          </div>
        </form>
      {:else if command.name === 'color'}
        <form class="space-y-4" on:submit|preventDefault={onColorDialogSubmit}>
          <div class="flex items-center gap-2">
            {#each colorDialogSections as section, index}
              <button
                type="button"
                class="btn {colorDialogCurrentSection === section
                  ? 'variant-filled-primary'
                  : 'hover:variant-soft-surface'}"
                on:click={() => (colorDialogSectionIndex = index)}
              >
                <Icon icon={section.icon} />
                <span>{section.label}</span>
              </button>
            {/each}
          </div>

          {#if colorDialogCurrentSection.name === 'presets'}
            <div class="grid grid-cols-10 gap-2">
              {#each colorPalette as color}
                <button
                  type="button"
                  class="btn-icon w-auto"
                  style="background-color: {color}; border-radius: var(--theme-rounded-base)"
                  on:click={() => (colorDialogColor = color)}
                />
              {/each}
            </div>
          {/if}

          <!-- {#if colorDialogCurrentSection.name === 'picker'}
            <ColorPicker isDialog={false} />
          {/if} -->

          <label class="label">
            <span>Color (hex)</span>
            <input type="text" name="hex" class="input" bind:value={colorDialogColor} />
          </label>
          <div class="flex items-stretch gap-2">
            <button
              id="btn-color-submit"
              type="submit"
              class="variant-filled-primary btn w-full flex-1"
            >
              Submit
            </button>
            {#if editor?.getAttributes('textStyle').color}
              <button
                type="button"
                class="variant-filled-error btn-icon"
                style="border-radius: var(--theme-rounded-base)"
                on:click={() => editor?.chain().focus().unsetColor().run()}
              >
                <Icon icon="ph:trash" />
              </button>
            {/if}
          </div>
        </form>
      {/if}
    </div>
  {/each}
{/if}
