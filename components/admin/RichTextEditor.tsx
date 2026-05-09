'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo, Link as LinkIcon, Code, Image as ImageIcon, Smile, Upload, ArrowDownUp } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading', 'list_item'],
      defaultLineHeight: 'normal',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: attributes => {
              if (attributes.lineHeight === this.options.defaultLineHeight) {
                return {}
              }
              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({ commands }) => {
        return this.options.types.every((type: string) => commands.updateAttributes(type, { lineHeight }))
      },
      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every((type: string) => commands.resetAttributes(type, 'lineHeight'))
      },
    }
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    }
  }
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLineHeightMenu, setShowLineHeightMenu] = useState(false);
  const [bubbleMenuPos, setBubbleMenuPos] = useState({ top: 0, left: 0, visible: false });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      LineHeight,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cluso-deep underline',
        },
      }),
      CodeBlock,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { empty, ranges } = editor.state.selection;
      if (empty || editor.isActive('image') || editor.isActive('codeBlock')) {
        setBubbleMenuPos(prev => ({ ...prev, visible: false }));
        return;
      }
      
      const { view } = editor;
      const { state } = view;
      const { from, to } = state.selection;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      const editorDom = view.dom.getBoundingClientRect();

      const top = Math.min(start.top, end.top) - editorDom.top - 40;
      const left = (start.left + end.left) / 2 - editorDom.left;

      setBubbleMenuPos({ top: top > 0 ? top : 0, left: left > 0 ? left : 0, visible: true });
    }
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImageUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('Image must be less than 2MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blog');
      formData.append('storage', 'auto');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.secure_url }).run();
      } else {
        const data = await res.json().catch(() => null);
        alert(typeof data?.error === 'string' ? data.error : 'Upload failed.');
      }
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onEmojiClick = (emojiData: any) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmojiPicker(false);
  };

  if (!editor) return null;

  const ToolButton = ({ onClick, active, disabled, children }: { onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-cluso-deep/10 text-cluso-deep' : 'text-gray-500 hover:bg-gray-100'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-visible bg-white relative">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Bubble Menu Custom */}
      {bubbleMenuPos.visible && (
        <div 
          className="absolute z-10 flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg -translate-x-1/2 transition-all duration-75"
          style={{ top: `${bubbleMenuPos.top}px`, left: `${bubbleMenuPos.left}px` }}
        >
          <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <Bold size={14} />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <Italic size={14} />
          </ToolButton>
          <ToolButton onClick={setLink} active={editor.isActive('link')}>
            <LinkIcon size={14} />
          </ToolButton>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50/50 flex-wrap relative">
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic size={16} />
        </ToolButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
          <Heading1 size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 size={16} />
        </ToolButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          <Quote size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>
          <Code size={16} />
        </ToolButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        
        {/* Line Height Menu */}
        <div className="relative">
          <ToolButton onClick={() => setShowLineHeightMenu(!showLineHeightMenu)}>
            <ArrowDownUp size={16} />
          </ToolButton>
          {showLineHeightMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLineHeightMenu(false)}></div>
              <div className="absolute top-10 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col min-w-[120px] py-1">
                {['1', '1.2', '1.5', '2', '2.5', '3'].map((lh) => (
                  <button
                    key={lh}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setLineHeight(lh).run();
                      setShowLineHeightMenu(false);
                    }}
                    className={`px-4 py-2 text-sm text-left hover:bg-gray-100 ${editor.isActive({ lineHeight: lh }) ? 'text-cluso-deep font-medium bg-cluso-deep/5' : 'text-gray-700'}`}
                  >
                    {lh === '1' ? 'Single (1)' : lh}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolButton onClick={setLink} active={editor.isActive('link')}>
          <LinkIcon size={16} />
        </ToolButton>
        <ToolButton onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload size={16} />
        </ToolButton>
        <ToolButton onClick={addImageUrl}>
          <ImageIcon size={16} />
        </ToolButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        
        <div className="relative">
          <ToolButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile size={16} />
          </ToolButton>
          {showEmojiPicker && (
            <div className="absolute top-10 left-0 z-50 shadow-xl rounded-xl">
              <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)}></div>
              <div className="relative z-10">
                <EmojiPicker onEmojiClick={onEmojiClick} width={280} height={350} />
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </ToolButton>
      </div>

      {/* Editor */}
      <div className="p-4 min-h-[200px] max-h-[60vh] overflow-y-auto" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} className="prose max-w-none focus:outline-none focus:ring-0" />
      </div>
    </div>
  );
}
