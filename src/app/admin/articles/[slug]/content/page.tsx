"use client";

import React, { useState, useEffect, useRef, Children } from "react";
import type { Data, Slot } from "@measured/puck";
import { useRouter, useParams } from "next/navigation";
import { PuckEditor } from "@/app/components/PuckEditor";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import AdminHeader from "@/app/components/AdminHeader";
import { config } from "@/app/components/Puck.config";


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
        <div>
            <AdminHeader/>
            <br />
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