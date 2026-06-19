'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import React, { useEffect } from 'react';
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Minus 
} from 'lucide-react';

interface TiptapEditorProps {
  content: Record<string, any> | string;
  onChange: (contentJson: Record<string, any>) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-secondary underline hover:text-secondary-dark transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 border border-white/10',
        },
      }),
    ],
    content: typeof content === 'string' ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }] } : content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[250px] max-h-[500px] overflow-y-auto px-4 py-3 text-white placeholder-gray-500 bg-[#020C1B]/80 rounded-b-xl border-x border-b border-white/10 text-sm font-sans',
      },
    },
  });

  // Keep content in sync when loaded asynchronously (e.g. edit forms)
  useEffect(() => {
    if (!editor || !content) return;
    
    const currentJson = editor.getJSON();
    if (JSON.stringify(currentJson) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').url;
    const url = window.prompt('Enter Link URL:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-col w-full rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0A192F] border border-white/10 rounded-t-xl select-none">
        
        {/* H1 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <Heading1 className="h-4 w-4" />
        </button>

        {/* H2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <Heading2 className="h-4 w-4" />
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1" />

        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <Bold className="h-4 w-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <Italic className="h-4 w-4" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('underline') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <List className="h-4 w-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('blockquote') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <Quote className="h-4 w-4" />
        </button>

        {/* Code Block */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('codeBlock') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${editor.isActive('link') ? 'text-secondary bg-white/5' : 'text-gray-400'}`}
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
