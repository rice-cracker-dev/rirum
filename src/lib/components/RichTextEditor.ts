import type { Editor, EditorOptions, Extensions } from '@tiptap/core';
import type { PopupSettings } from '@skeletonlabs/skeleton';
import { writable } from 'svelte/store';
import { colord } from 'colord';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';

export const RichTextEditorExtensions: Extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link,
  Image,
  TextStyle,
  Color,
];

export const RichTextEditorInitialOptions: Partial<EditorOptions> = {
  extensions: RichTextEditorExtensions,
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none outline-none gap-0',
    },
  },
};

export const colorPalette = [
  '#a4552d',
  '#7166d9',
  '#6cc042',
  '#be55c2',
  '#a5ba2e',
  '#d7418f',
  '#52c574',
  '#d54156',
  '#429a35',
  '#825aa2',
  '#b7b140',
  '#5b7dc8',
  '#dcaf3e',
  '#bf95df',
  '#51741a',
  '#dc7fae',
  '#84a74c',
  '#9e4774',
  '#60c5a4',
  '#d44e2c',
  '#4eacd7',
  '#df8830',
  '#308c76',
  '#b75962',
  '#41844a',
  '#e39271',
  '#69702e',
  '#b48f3b',
  '#adb46f',
  '#896a2f',
].sort((a, b) => {
  const colorA = colord(a);
  const colorB = colord(b);

  return colorA.hue() - colorB.hue();
});

export const dialogName = writable<string | null>(null);

export type ToolbarCommand = {
  name: string;
  icon: string;
  dialog?: PopupSettings;
  isActive: boolean;
  canExecute?: boolean;
  callback?: () => void;
};

export const getToolbarCommands = (editor: Editor | null): ToolbarCommand[][] | null => {
  if (!editor) {
    return null;
  }

  return [
    [
      {
        name: 'undo',
        icon: 'ph:arrow-u-up-left',
        isActive: editor.isActive('undo'),
        canExecute: editor.can().undo(),
        callback: () => editor.chain().focus().undo().run(),
      },
      {
        name: 'redo',
        icon: 'ph:arrow-u-up-right',
        isActive: editor.isActive('redo'),
        canExecute: editor.can().redo(),
        callback: () => editor.chain().focus().redo().run(),
      },
    ],
    ['left', 'center', 'right', 'justify'].map<ToolbarCommand>((textAlign) => ({
      name: `align-${textAlign}`,
      icon: `ph:text-align-${textAlign}`,
      isActive: editor.isActive({ textAlign }),
      callback: () => editor.chain().focus().setTextAlign(textAlign).run(),
    })),
    [
      {
        name: 'bold',
        icon: 'ph:text-b',
        isActive: editor.isActive('bold'),
        callback: () => editor.chain().focus().toggleBold().run(),
      },
      {
        name: 'italic',
        icon: 'ph:text-italic',
        isActive: editor.isActive('italic'),
        callback: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        name: 'underline',
        icon: 'ph:text-underline',
        isActive: editor.isActive('underline'),
        callback: () => editor.chain().focus().toggleUnderline().run(),
      },
      {
        name: 'strikethrough',
        icon: 'ph:text-strikethrough',
        isActive: editor.isActive('strike'),
        callback: () => editor.chain().focus().toggleStrike().run(),
      },
    ],
    [
      {
        name: 'heading-one',
        icon: 'ph:text-h-one',
        isActive: editor.isActive('heading', { level: 1 }),
        callback: () => editor.chain().focus().setHeading({ level: 1 }).run(),
      },
      {
        name: 'heading-two',
        icon: 'ph:text-h-two',
        isActive: editor.isActive('heading', { level: 2 }),
        callback: () => editor.chain().focus().setHeading({ level: 2 }).run(),
      },
      {
        name: 'heading-three',
        icon: 'ph:text-h-three',
        isActive: editor.isActive('heading', { level: 3 }),
        callback: () => editor.chain().focus().setHeading({ level: 3 }).run(),
      },
      {
        name: 'paragraph',
        icon: 'ph:paragraph',
        isActive: editor.isActive('paragraph'),
        callback: () => editor.chain().focus().setParagraph().run(),
      },
      {
        name: 'codeblock',
        icon: 'ph:code-block',
        dialog: {
          event: 'click',
          placement: 'bottom',
          target: 'codeblock-popup',
        },
        isActive: editor.isActive('codeBlock'),
      },
    ],
    [
      {
        name: 'blockquote',
        icon: 'ph:quotes',
        isActive: editor.isActive('blockquote'),
        callback: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        name: 'horizontal-rule',
        icon: 'ph:arrows-out-line-vertical',
        isActive: false,
        callback: () => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        name: 'bullet-list',
        icon: 'ph:list-bullets',
        isActive: editor.isActive('bulletList'),
        callback: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        name: 'ordered-list',
        icon: 'ph:list-numbers',
        isActive: editor.isActive('orderedList'),
        callback: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        name: 'code',
        icon: 'ph:code',
        isActive: editor.isActive('code'),
        callback: () => editor.chain().focus().toggleCode().run(),
      },
      {
        name: 'link',
        icon: 'ph:link',
        dialog: {
          event: 'click',
          placement: 'bottom',
          target: 'link-popup',
        },
        isActive: editor.isActive('link'),
      },
      {
        name: 'image',
        icon: 'ph:image',
        dialog: {
          event: 'click',
          placement: 'bottom',
          target: 'image-popup',
        },
        isActive: editor.isActive('image'),
      },
      {
        name: 'color',
        icon: 'ph:paint-brush-broad',
        dialog: {
          event: 'click',
          placement: 'bottom',
          target: 'color-popup',
          closeQuery: '#btn-color-submit',
        },
        isActive: false,
      },
    ],
  ];
};
