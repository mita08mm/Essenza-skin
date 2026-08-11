'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import DOMPurify from 'dompurify';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { IconButton } from './icon-button';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: [] as string[],
};

export function sanitizeRichText(html: string) {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, disabled, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false, blockquote: false }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'richtext-content',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? '' : sanitizeRichText(editor.getHTML());
      onChange(html);
    },
  });

  if (!editor) return null;

  return (
    <div className="richtext-wrapper">
      <div className="richtext-toolbar">
        <IconButton
          bordered
          active={editor.isActive('bold')}
          disabled={disabled}
          label="Negrita"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </IconButton>
        <IconButton
          bordered
          active={editor.isActive('italic')}
          disabled={disabled}
          label="Cursiva"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </IconButton>
        <span className="richtext-toolbar-divider" aria-hidden="true" />
        <IconButton
          bordered
          active={editor.isActive('bulletList')}
          disabled={disabled}
          label="Lista"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </IconButton>
        <IconButton
          bordered
          active={editor.isActive('orderedList')}
          disabled={disabled}
          label="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </IconButton>
      </div>
      <EditorContent editor={editor} className="textarea-base richtext-editor" />
    </div>
  );
}
