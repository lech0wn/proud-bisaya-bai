"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Data } from "@measured/puck";
import { useRouter, useParams } from "next/navigation";
import { PuckEditor } from "@/app/components/PuckEditor";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import AdminHeader from "@/app/components/AdminHeader";

type HeadingProps = { text: string; level: number };
type ParagraphProps = { text: string };
type ImageBlockProps = { src: string; alt: string; caption?: string };

import type { Config } from "@measured/puck";

const components: Config["components"] = {
    Heading: {
        label: "Heading",
        fields: {
        text: { type: "text", label: "Text" },
        level: { type: "number", label: "Level", min: 1, max: 6 },
        },
        defaultProps: { text: "Heading Text", level: 2 },
        render: (props) => {
        const { text, level } = props as unknown as HeadingProps;
        const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        return <Tag className="font-bold mb-4">{text}</Tag>;
        },
    },
    Paragraph: {
        label: "Paragraph",
        fields: { text: { type: "textarea", label: "Text" } },
        defaultProps: { text: "Paragraph text here." },
        render: (props) => {
        const { text } = props as unknown as ParagraphProps;
        return <p className="mb-4 leading-relaxed">{text}</p>;
        },
    },
    ImageBlock: {
        label: "Image",
        fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt text" },
        caption: { type: "text", label: "Caption (optional)" },
        },
        defaultProps: { src: "", alt: "", caption: "" },
        render: (props) => {
        const { src, alt, caption } = props as unknown as ImageBlockProps;
        if (!src)
            return (
            <div className="mb-4 p-4 bg-gray-100 rounded text-gray-500 text-center">
                Click to add image URL or upload below
            </div>
            );
        return (
            <figure className="mb-4">
            <img src={src} alt={alt} className="w-full rounded-lg object-cover" />
            {caption && (
                <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                {caption}
                </figcaption>
            )}
            </figure>
        );
        },
    },
    };

    const config: Config = { components };

    export default function ArticleContentPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const isEdit = slug !== "new";

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState<Data>({
        content: [],
        root: { props: {} },
    });

    const [metadata, setMetadata] = useState<{
        title: string;
        slug: string;
        author: string;
        category: string;
        subcategory?: string;
        thumbnail_url?: string;
        category_slug: string;
        subcategory_slug?: string;
    } | null>(null);

    useEffect(() => {
        const loadData = async () => {
        const savedMetadata = sessionStorage.getItem("articleMetadata");
        
        if (slug === "new") {
            if (savedMetadata) {
            setMetadata(JSON.parse(savedMetadata));
            } else {
            alert("No metadata found. Redirecting to metadata page.");
            router.push("/admin/articles/new/metadata");
            }
        } else {
            try {
            const res = await fetch(`/api/admin/articles/${slug}`);
            if (!res.ok) throw new Error("Failed to fetch article");

            const article = await res.json();
            
            if (savedMetadata) {
                setMetadata(JSON.parse(savedMetadata));
            }else{
                setMetadata({
                title: article.title,
                slug: article.slug,
                author: article.author,
                category: article.category,
                subcategory: article.subcategory,
                thumbnail_url: article.thumbnail_url,
                category_slug: article.category_slug,
                subcategory_slug: article.subcategory_slug,
            });
        }

            if (article.content) {
                try {
                const parsedContent =
                    typeof article.content === "string"
                    ? JSON.parse(article.content)
                    : article.content;
                setData(parsedContent);
                } catch (e) {
                console.error("Failed to parse content:", e);
                setData({ content: [], root: { props: {} } });
                }
            }
            } catch (error: any) {
            console.error("Error fetching article:", error);
            alert(`Failed to load article: ${error.message}`);
            router.push("/admin/dashboard");
            }
        }
        setLoading(false);
        };

        loadData();
    }, [slug, router]);

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Image upload failed");

        return data.url;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
        const imageUrl = await uploadImage(file);

        await navigator.clipboard.writeText(imageUrl);
        alert(
            `Image uploaded successfully!\nURL copied to clipboard:\n${imageUrl}\n\nPaste this URL into the Image Block's "Image URL" field.`
        );
        } catch (error: any) {
        alert(`Upload failed: ${error.message}`);
        } finally {
        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        }
    };

    const handleSave = async (puckData: Data) => {
        if (!metadata) {
        alert("Metadata not found");
        return;
        }

        setSaving(true);
        try {
        const payload = {
            title: metadata.title,
            slug: metadata.slug,
            author: metadata.author,
            category: metadata.category,
            subcategory: metadata.subcategory || undefined,
            thumbnail_url: metadata.thumbnail_url || undefined,
            category_slug: metadata.category_slug,
            subcategory_slug: metadata.subcategory_slug || undefined,
            content: JSON.stringify(puckData),
        };

        let res;
        if (isEdit) {
            res = await fetch(`/api/admin/articles/${slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });
        } else {
            res = await fetch("/api/admin/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });
        }

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.error || "Failed to save article");
        }

        alert(isEdit ? "Article updated successfully!" : "Article published successfully!");
        sessionStorage.removeItem("articleMetadata");
        router.push("/admin/dashboard");
        } catch (e: any) {
        console.error("Save error:", e);
        alert(`Save failed: ${e.message}`);
        } finally {
        setSaving(false);
        }
    };

    if (loading) {
        return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
            </div>
        </div>
        );
    }

    if (!metadata) {
        return null;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-y-hidden">
            <AdminHeader/>
        <div className="bg-white border-b shadow-sm px-6 py-4">
            <button
            onClick={() => router.push(`/admin/articles/${slug}/metadata`)}
            className="text-blue-600 hover:underline text-sm mb-2 inline-block"
            >
            ← Back to Metadata
            </button>
            <h1 className="text-2xl text-black font-bold">
            {isEdit ? "Edit" : "Create"} Content: {metadata.title}
            </h1>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
                <strong>💡 How to add images:</strong> Click "Upload Image" button
                below, select your image, and the URL will be copied to your
                clipboard. Then paste it into the Image Block's "Image URL" field
                in the editor.
            </p>
            </div>
            <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {uploading ? "Uploading..." : "📤 Upload Image"}
            </button>
            <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            />
        </div>
        
        <PuckEditor
            config={config}
            data={data}
            onPublish={handleSave}
            onChange={setData}
        />

        <LoadingOverlay
            saving={saving}
            uploading={uploading}
            uploadingThumbnail={false}
        />
        </div>
    );
}