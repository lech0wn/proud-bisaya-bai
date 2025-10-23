import type { Config, Slot } from "@measured/puck";
import { ReactNode, useEffect, useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

type props = {
    Heading: { text: string | ReactNode; level: number; };
    Paragraph: { text: string | ReactNode; };
    ImageBlock: { src: string; alt: string; caption?: string | ReactNode; };
    ColumnBlock: { columns: Array<{ content: Slot }>; };
    TiptapRichText: { content: string };
};

export const config: Config<props> = {
    components: {
        Heading: {
            label: "Heading",
            fields: {
                text: { type: "text", label: "Text", contentEditable: true },
                level: { type: "number", label: "Level", min: 1, max: 6 },
            },
            defaultProps: { text: "Heading Text", level: 2 },
            render: ({ text, level }) => {
                const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
                return <Tag className="font-bold mb-4 p-4">{text}</Tag>;
            },
        },

        Paragraph: {
            label: "Paragraph",
            fields: {
                text: { type: "textarea", label: "Text", contentEditable: true }
            },
            defaultProps: { text: "Paragraph text here." },
            render: ({ text }) => <p className="mb-4 leading-relaxed p-4">{text}</p>,
        },

        ImageBlock: {
            label: "Image",
            fields: {
                src: { type: "text", label: "Image URL" },
                alt: { type: "text", label: "Alt text" },
                caption: { type: "text", label: "Caption (optional)" },
            },
            defaultProps: { src: "", alt: "", caption: "" },
            render: ({ src, alt, caption }) => {
                if (!src) {
                    return (
                        <div className="mb-4 p-4 bg-gray-100 rounded text-gray-500 text-center">
                            Click to add image URL or upload below
                        </div>
                    );
                }
                return (
                    <figure className="mb-4">
                        <img src={src} alt={alt} className="w-full rounded-lg object-cover p-4" />
                        {caption && (
                            <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                                {caption}
                            </figcaption>
                        )}
                    </figure>
                );
            },
        },

        ColumnBlock: {
            label: "Column Block",
            fields: {
                columns: {
                    type: "array",
                    label: "Columns",
                    arrayFields: { content: { type: "slot" } },
                    min: 1,
                    max: 6,
                }
            },
            defaultProps: {
                columns: [{ content: [] }, { content: [] }],
            },
            render: ({ columns }) => (
                <div
                    className="gap-4 mb-4"
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${columns.length}, 1fr)`
                    }}
                >
                    {columns.map(({ content: Content }, index) => (
                        <Content key={index} />
                    ))}
                </div>
            ),
        },

        TiptapRichText: {
            label: "Rich Text",
            fields: {
                content: {
                    type: "custom",
                    label: "Content",
                    render: ({ value, onChange }) => {
                        const [showToolbar, setShowToolbar] = useState(false);
                        const [isEditing, setIsEditing] = useState(false);
                        const editor = useEditor({
                            extensions: [
                                StarterKit,
                                Underline,
                                TextAlign.configure({
                                    types: ['heading', 'paragraph'],
                                }),
                            ],
                            content: value || '<p>Start typing...</p>',
                            immediatelyRender: false,
                            onUpdate: ({ editor }) => {
                                const html = editor.getHTML();
                                onChange(html);
                                setIsEditing(true);
                            },
                            onFocus: () => {
                                setShowToolbar(true);
                                setIsEditing(true);
                            },
                            onBlur: () => {
                                setShowToolbar(false);
                                setIsEditing(false);
                            },
                        });

                        useEffect(() => {
                            if (editor && value !== editor.getHTML()) {
                                editor.commands.setContent(value || '<p>Start typing...</p>');
                            }
                        }, [value, editor]);

                        if (!editor) {
                            return <div className="p-4 text-gray-500">Loading editor...</div>;
                        }

                        return (
                            <div className="relative">
                                {/* Floating Toolbar */}
                                {showToolbar && (
                                    <div className="fixed top-22 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg border-slate-400 rounded-lg p-2 flex gap-1">
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                editor.chain().focus().toggleBold().run();
                                            }}
                                            className={`px-3 py-1 rounded ${
                                                editor.isActive('bold') ? 'bg-gray-300' : 'bg-white'
                                            } border hover:bg-gray-200`}
                                            title="Bold"
                                        >
                                            <strong>B</strong>
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                editor.chain().focus().toggleItalic().run();
                                            }}
                                            className={`px-3 py-1 rounded ${
                                                editor.isActive('italic') ? 'bg-gray-300' : 'bg-white'
                                            } border hover:bg-gray-200`}
                                            title="Italic"
                                        >
                                            <em>I</em>
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                editor.chain().focus().toggleUnderline().run();
                                            }}
                                            className={`px-3 py-1 rounded ${
                                                editor.isActive('underline') ? 'bg-gray-300' : 'bg-white'
                                            } border hover:bg-gray-200`}
                                            title="Underline"
                                        >
                                            <u>U</u>
                                        </button>
                                        <div className="w-px bg-gray-300 mx-1" />
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                editor.chain().focus().setTextAlign('left').run();
                                            }}
                                            className={`px-3 py-1 rounded ${
                                                editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : 'bg-white'
                                            } border hover:bg-gray-200`}
                                            title="Align Left"
                                        >
                                            <svg fill="#000000" width="14px" height="14px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 6.1679 11.3594 L 49.8085 11.3594 C 50.8165 11.3594 51.6133 10.5859 51.6133 9.5781 C 51.6133 8.5937 50.8165 7.8203 49.8085 7.8203 L 6.1679 7.8203 C 5.1601 7.8203 4.3867 8.5937 4.3867 9.5781 C 4.3867 10.5859 5.1601 11.3594 6.1679 11.3594 Z M 6.1679 23.6406 L 32.5117 23.6406 C 33.4960 23.6406 34.3164 22.8672 34.3164 21.8594 C 34.3164 20.8750 33.4960 20.1015 32.5117 20.1015 L 6.1679 20.1015 C 5.1601 20.1015 4.3867 20.8750 4.3867 21.8594 C 4.3867 22.8672 5.1601 23.6406 6.1679 23.6406 Z M 6.1679 35.9219 L 49.8085 35.9219 C 50.8165 35.9219 51.6133 35.1250 51.6133 34.1406 C 51.6133 33.1563 50.8165 32.3828 49.8085 32.3828 L 6.1679 32.3828 C 5.1601 32.3828 4.3867 33.1563 4.3867 34.1406 C 4.3867 35.1250 5.1601 35.9219 6.1679 35.9219 Z M 6.1679 48.1797 L 32.5117 48.1797 C 33.4960 48.1797 34.3164 47.4063 34.3164 46.4219 C 34.3164 45.4375 33.4960 44.6406 32.5117 44.6406 L 6.1679 44.6406 C 5.1601 44.6406 4.3867 45.4375 4.3867 46.4219 C 4.3867 47.4063 5.1601 48.1797 6.1679 48.1797 Z"/></svg>
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                editor.chain().focus().setTextAlign('center').run();
                                            }}
                                            className={`px-3 py-1 rounded ${
                                                editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : 'bg-white'
                                            } border hover:bg-gray-200`}
                                            title="Align Center"
                                        >
                                            <svg fill="#000000" width="14px" height="14px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 6.1679 11.3594 L 49.8085 11.3594 C 50.8165 11.3594 51.6133 10.5859 51.6133 9.5781 C 51.6133 8.5937 50.8165 7.8203 49.8085 7.8203 L 6.1679 7.8203 C 5.1601 7.8203 4.3867 8.5937 4.3867 9.5781 C 4.3867 10.5859 5.1601 11.3594 6.1679 11.3594 Z M 14.8164 23.6406 L 41.1601 23.6406 C 42.1679 23.6406 42.9648 22.8672 42.9648 21.8594 C 42.9648 20.8750 42.1679 20.1015 41.1601 20.1015 L 14.8164 20.1015 C 13.8320 20.1015 13.0351 20.8750 13.0351 21.8594 C 13.0351 22.8672 13.8320 23.6406 14.8164 23.6406 Z M 6.1679 35.9219 L 49.8085 35.9219 C 50.8165 35.9219 51.6133 35.1250 51.6133 34.1406 C 51.6133 33.1563 50.8165 32.3828 49.8085 32.3828 L 6.1679 32.3828 C 5.1601 32.3828 4.3867 33.1563 4.3867 34.1406 C 4.3867 35.1250 5.1601 35.9219 6.1679 35.9219 Z M 14.8164 48.1797 L 41.1601 48.1797 C 42.1679 48.1797 42.9648 47.4063 42.9648 46.4219 C 42.9648 45.4375 42.1679 44.6406 41.1601 44.6406 L 14.8164 44.6406 C 13.8320 44.6406 13.0351 45.4375 13.0351 46.4219 C 13.0351 47.4063 13.8320 48.1797 14.8164 48.1797 Z"/></svg>
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                editor.chain().focus().setTextAlign('right').run();
                                            }}
                                            className={`px-3 py-1 rounded ${
                                                editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : 'bg-white'
                                            } border hover:bg-gray-200`}
                                            title="Align Right"
                                        >
                                            <svg fill="#000000" width="14px" height="14px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M 6.1679 11.3594 L 49.8085 11.3594 C 50.8165 11.3594 51.6133 10.5859 51.6133 9.5781 C 51.6133 8.5937 50.8165 7.8203 49.8085 7.8203 L 6.1679 7.8203 C 5.1601 7.8203 4.3867 8.5937 4.3867 9.5781 C 4.3867 10.5859 5.1601 11.3594 6.1679 11.3594 Z M 23.4648 23.6406 L 49.8085 23.6406 C 50.8165 23.6406 51.6133 22.8672 51.6133 21.8594 C 51.6133 20.8750 50.8165 20.1015 49.8085 20.1015 L 23.4648 20.1015 C 22.4804 20.1015 21.6835 20.8750 21.6835 21.8594 C 21.6835 22.8672 22.4804 23.6406 23.4648 23.6406 Z M 6.1679 35.9219 L 49.8085 35.9219 C 50.8165 35.9219 51.6133 35.1250 51.6133 34.1406 C 51.6133 33.1563 50.8165 32.3828 49.8085 32.3828 L 6.1679 32.3828 C 5.1601 32.3828 4.3867 33.1563 4.3867 34.1406 C 4.3867 35.1250 5.1601 35.9219 6.1679 35.9219 Z M 23.4648 48.1797 L 49.8085 48.1797 C 50.8165 48.1797 51.6133 47.4063 51.6133 46.4219 C 51.6133 45.4375 50.8165 44.6406 49.8085 44.6406 L 23.4648 44.6406 C 22.4804 44.6406 21.6835 45.4375 21.6835 46.4219 C 21.6835 47.4063 22.4804 48.1797 23.4648 48.1797 Z"/></svg>
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                editor.chain().focus().setTextAlign('justify').run();
                                            }}
                                            className={`px-3 py-1 rounded ${
                                                editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : 'bg-white'
                                            } border hover:bg-gray-200`}
                                            title="Justify"
                                        >
                                            <svg width="14px" height="14px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="#000000ff" strokeWidth="1.5" strokeLinecap="round">
                                                <line x1="0.5" y1="5" x2="29.5" y2="5" />
                                                <line x1="0.5" y1="11.2" x2="29.5" y2="11.2" />
                                                <line x1="0.5" y1="17.4" x2="29.5" y2="17.4" />
                                                <line x1="0.5" y1="23.6" x2="29.5" y2="23.6" />
                                            </g>
                                            </svg>

                                        </button>
                                    </div>
                                )}

                                {/* Editor Content */}
                                <div className="border rounded-lg overflow-hidden">
                                    <EditorContent
                                        editor={editor}
                                        className="prose max-w-none min-h-fit p-4"
                                    />
                                </div>
                            </div>
                        );
                    },
                },
            },
            defaultProps: {
                content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit....</p>',
            },
            render: ({ content }) => {
                const [isEditing, setIsEditing] = useState(false);
                const editor = useEditor({
                    extensions: [
                        StarterKit,
                        Underline,
                        TextAlign.configure({
                            types: ['heading', 'paragraph'],
                        }),
                    ],
                    content,
                    editable: isEditing,
                    immediatelyRender: false,
                });

                if (!editor) {
                    return <div className="p-4 text-gray-500">Loading editor...</div>;
                }

                return (
                    <div
                        className="mb-4 p-4 prose max-w-none relative"
                        onClick={() => setIsEditing(true)}
                        onBlur={() => setIsEditing(false)}
                    >
                        {isEditing ? (
                            <EditorContent editor={editor} />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        )}
                    </div>
                );
            },
        },
    },
};