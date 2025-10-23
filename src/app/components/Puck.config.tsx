import type { Config, Slot } from "@measured/puck";
import { ReactNode } from "react";
import { PuckRichText, PuckRichTextProps } from "@tohuhono/puck-rich-text/legacy";

type props = {
    Heading: { text: string | ReactNode; level: number; };
    Paragraph: { text: string | ReactNode; };
    ImageBlock: { src: string; alt: string; caption?: string | ReactNode; };
    ColumnBlock: { columns: Array<{ content: Slot }>; };
    RichTextBlock: { text: string };
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
                    {columns.map((column, index) => {
                        const Content = column.content;
                        return <Content key={index} />;
                    })}
                </div>
            ),
        },
        
        RichTextBlock: {
            label: "Rich Text",
            fields: {
                text: {
                    type: "textarea",
                    label: "Text",
                    contentEditable: true,
                }
            },
            defaultProps: {
                text: "<p>Edit with <strong>bold</strong>, <em>italic</em>, and <u>underline</u> formatting.</p>"
            },
            render: ({ text, puck }) => {
                return (
                    <div className="mb-4 p-4">
                        <div 
                            dangerouslySetInnerHTML={{ __html: text }}
                            suppressContentEditableWarning
                            contentEditable={puck.isEditing}
                            onBlur={(e) => {
                                if (puck.isEditing) {
                                    // Update the text when user finishes editing
                                    const newText = e.currentTarget.innerHTML;
                                    // Note: You may need to handle this update through Puck's API
                                }
                            }}
                        />
                    </div>
                );
            },
        },
    },
};