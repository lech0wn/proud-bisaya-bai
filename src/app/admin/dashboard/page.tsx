"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, Bell } from "lucide-react";
import AdminHeader from "@/app/components/AdminHeader";

type Article = {
    id: string;
    slug: string;
    title: string;
    author?: string;
    category?: string;
    subcategory?: string;
    created_at?: string;
    updated_at?: string;
    thumbnail_url?: string;
    status?: string;
    isPublished?: boolean;
    isArchived?: boolean;
    isEditorsPick?: boolean;
    isBreakingNews?: boolean;
};

export default function AdminDashboardPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("pending");

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    async function fetchArticles() {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/admin/articles");
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Invalid JSON from server");
            }

            // Parse the articles and ensure boolean values for the status fields
            let articlesArray: Article[] = [];

            if (Array.isArray(data)) {
                articlesArray = data;
            } else if (Array.isArray(data.articles)) {
                articlesArray = data.articles;
            } else if (Array.isArray(data.data)) {
                articlesArray = data.data;
            }

            // Ensure boolean values for the status fields
            const normalizedArticles = articlesArray.map(article => ({
                ...article,
                isEditorsPick: Boolean(article.isEditorsPick),
                isBreakingNews: Boolean(article.isBreakingNews),
                isPublished: Boolean(article.isPublished),
                isArchived: Boolean(article.isArchived)
            }));

            setArticles(normalizedArticles);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Helper function to update a single article in state
    const updateArticleInState = (slug: string, updates: Partial<Article>) => {
        setArticles(prev => prev.map(article =>
            article.slug === slug ? { ...article, ...updates } : article
        ));
    };

    async function handlePublish(slug: string) {
        if (!confirm("Publish this article?")) return;
        try {
            const res = await fetch(`/api/admin/articles/${slug}/publish`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Failed to publish");

            // Update state optimistically
            updateArticleInState(slug, {
                isPublished: true,
                isArchived: false,
                status: "published"
            });
        } catch (err: any) {
            alert(err.message);
            // Refresh to get correct state from server
            fetchArticles();
        }
    }

    async function handleUnpublish(slug: string) {
        if (!confirm("Unpublish this article? It will return to pending status.")) return;
        try {
            const res = await fetch(`/api/admin/articles/${slug}/unpublish`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Failed to unpublish");

            // Update state optimistically
            updateArticleInState(slug, {
                isPublished: false,
                isArchived: false,
                status: "pending"
            });
        } catch (err: any) {
            alert(err.message);
            fetchArticles();
        }
    }

    async function handleArchive(slug: string) {
        if (!confirm("Archive this article?")) return;
        try {
            const res = await fetch(`/api/admin/articles/${slug}/archive`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Failed to archive");

            // Update state optimistically
            updateArticleInState(slug, {
                isArchived: true,
                isPublished: false
            });
        } catch (err: any) {
            alert(err.message);
            fetchArticles();
        }
    }

    async function handleUnarchive(slug: string) {
        if (!confirm("Unarchive this article? It will return to its previous state.")) return;
        try {
            const res = await fetch(`/api/admin/articles/${slug}/unarchive`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Failed to unarchive");

            // Refresh to get the correct previous state
            fetchArticles();
        } catch (err: any) {
            alert(err.message);
            fetchArticles();
        }
    }

    async function handleToggleEditorsPick(slug: string, currentStatus: boolean = false) {
        const newStatus = !currentStatus;

        // Optimistic update
        updateArticleInState(slug, { isEditorsPick: newStatus });

        try {
            const res = await fetch(`/api/admin/articles/${slug}/editors-pick`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isEditorsPick: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update editor's pick status");

            // Get response data and update state with server response
            const data = await res.json();
            
            // refresh articles and sync state
            if (newStatus) {
                await fetchArticles();
            } else {
                // just update this article with the server response
                updateArticleInState(slug, { 
                    isEditorsPick: Boolean(data.isEditorsPick),
                    updated_at: data.updated_at 
                });
            }
        } catch (err: any) {
            alert(err.message);
            // Revert on error
            updateArticleInState(slug, { isEditorsPick: currentStatus });
        }
    }

    async function handleToggleBreakingNews(slug: string, currentStatus: boolean = false) {
        const newStatus = !currentStatus;

        // Optimistic update
        updateArticleInState(slug, { isBreakingNews: newStatus });

        try {
            const res = await fetch(`/api/admin/articles/${slug}/breaking-news`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isBreakingNews: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update breaking news status");

            const data = await res.json();
            
            // refresh articles and sync state
            if (newStatus) {
                await fetchArticles();
            } else {
                // just update this article with the server response
                updateArticleInState(slug, { 
                    isBreakingNews: Boolean(data.isBreakingNews),
                    updated_at: data.updated_at 
                });
            }
        } catch (err: any) {
            alert(err.message);
            // Revert on error
            updateArticleInState(slug, { isBreakingNews: currentStatus });
        }
    }

    const filteredArticles = articles.filter((article) => {
        if (activeTab === "pending") {
            return !article.isPublished && !article.isArchived;
        } else if (activeTab === "archived") {
            return article.isArchived;
        } else if (activeTab === "published") {
            return article.isPublished && !article.isArchived;
        }
        return false;
    });

    if (loading)
        return (
            <div className="max-w-6xl mx-auto p-6 text-center text-black">
                Loading articles...
            </div>
        );

    if (error)
        return (
            <div className="max-w-6xl mx-auto p-6 text-center">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 inline-block">
                    <h2 className="text-red-800 font-bold mb-2">Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchArticles}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-8 overflow-hidden">
            <AdminHeader />
            <div className="max-w-8xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
                        <div className="relative w-96 text-gray-600">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-900 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="text-black-900 w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-200 flex items-center justify-between">
                        <div className="flex gap-8 px-6">
                            <button
                                onClick={() => setActiveTab("pending")}
                                className={`py-4 font-medium border-b-2 transition-colors ${activeTab === "pending"
                                    ? "border-red-500 text-red-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                Pending Posts
                            </button>
                            <button
                                onClick={() => setActiveTab("archived")}
                                className={`py-4 font-medium border-b-2 transition-colors ${activeTab === "archived"
                                    ? "border-red-500 text-red-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                Archived Posts
                            </button>
                            <button
                                onClick={() => setActiveTab("published")}
                                className={`py-4 font-medium border-b-2 transition-colors ${activeTab === "published"
                                    ? "border-red-500 text-red-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                Published Posts
                            </button>
                        </div>
                        <div className="flex gap-8 px-6">
                            <button className="border-b border-gray-200 bg-gray-400 flex items-center gap-2 text-white font-bold px-4 py-2 rounded transition-colors hover:bg-gray-400 active:bg-gray-500">
                                Filter
                            </button>
                            <Link
                                href="/admin/articles/new/metadata"
                                className="border-b border-gray-200 bg-red-500 flex items-center gap-2 text-white font-bold px-4 py-2 rounded transition-colors active:bg-red-900"
                            >
                                Add Article
                            </Link>
                        </div>
                    </div>
                    {filteredArticles.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center">
                            <p className="text-black mb-4">
                                No articles found. Feel free to generate!
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-overlay">
                            <table className="min-w-full table-fixed">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                                            Cover & Status
                                        </th>
                                        <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                                            Article Title
                                        </th>
                                        <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                                            Author
                                        </th>
                                        <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                                            Status
                                        </th>
                                        <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                                            Category
                                        </th>
                                        <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                                            Quick Actions
                                        </th>
                                        <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArticles.map((a) => (
                                        <tr
                                            key={a.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                                                {a.thumbnail_url && (
                                                    <img
                                                        src={a.thumbnail_url}
                                                        alt={a.title}
                                                        className="mx-auto h-28 object-cover rounded-lg mb-2"
                                                    />
                                                )}
                                                {a.created_at && (
                                                    <div className="text-m text-black">
                                                        {new Date(a.created_at).toLocaleDateString()}
                                                    </div>
                                                )}
                                                {/* Show badges for special status */}
                                                <div className="flex flex-wrap gap-1 justify-center mt-2">
                                                    {a.isEditorsPick && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                            <Star size={12} className="fill-current" />
                                                            Editor's Pick
                                                        </span>
                                                    )}
                                                    {a.isBreakingNews && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                            <Bell size={12} />
                                                            Breaking
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="w-1/6 px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                                                {a.title}
                                            </td>
                                            <td className="w-1/6 px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                                                {a.author}
                                            </td>
                                            <td className="w-1/6 w-1/6 px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                                                {a.status ?? "no status:("}
                                            </td>
                                            <td className="w-1/6 px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                                                {a.category ?? "Uncategorized"}
                                                {a.subcategory && (
                                                    <span className="block text-xs text-gray-500">
                                                        {a.subcategory}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="w-1/6 px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                                                <div className="flex flex-col gap-2 items-center">
                                                    <button
                                                        onClick={() => handleToggleEditorsPick(a.slug, a.isEditorsPick)}
                                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 w-full max-w-[140px] ${a.isEditorsPick
                                                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700 shadow-sm'
                                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        aria-label={a.isEditorsPick ? 'Remove from favorites' : 'Add to favorites'}
                                                    >
                                                        <Star
                                                            size={18}
                                                            className={a.isEditorsPick ? "text-yellow-500 fill-current" : "text-gray-400"}
                                                            fill={a.isEditorsPick ? "currentColor" : "none"}
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {a.isEditorsPick ? 'Favorited' : 'Favorite'}
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleBreakingNews(a.slug, a.isBreakingNews)}
                                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 w-full max-w-[140px] ${a.isBreakingNews
                                                            ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        aria-label={a.isBreakingNews ? 'Mark as normal news' : 'Mark as breaking news'}
                                                    >
                                                        <Bell
                                                            size={18}
                                                            className={a.isBreakingNews ? "text-red-500 fill-current" : "text-gray-400"}
                                                            fill={a.isBreakingNews ? "currentColor" : "none"}
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {a.isBreakingNews ? 'Breaking!' : 'Breaking'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="w-1/6 px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                                                <div className="flex flex-col gap-1 items-center">
                                                    {!a.isPublished && !a.isArchived && (
                                                        <button
                                                            onClick={() => handlePublish(a.slug)}
                                                            className="text-white font-bold px-10 py-2 rounded-lg bg-green-500 hover:bg-green-600 w-full"
                                                        >
                                                            Publish
                                                        </button>
                                                    )}

                                                    {a.isPublished && !a.isArchived && (
                                                        <button
                                                            onClick={() => handleUnpublish(a.slug)}
                                                            className="text-white font-bold px-10 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 w-full"
                                                        >
                                                            Unpublish
                                                        </button>
                                                    )}

                                                    {a.isArchived === true && (
                                                        <button
                                                            onClick={() => handleUnarchive(a.slug)}
                                                            className="text-white font-bold px-10 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 w-full"
                                                        >
                                                            Unarchive
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/articles/${a.slug}`}
                                                        target="_blank"
                                                        className="bg-blue-500 text-white font-bold px-12 py-2 rounded-lg text-center hover:bg-blue-600 w-full"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/articles/${a.slug}/metadata`}
                                                        className="bg-yellow-500 text-white font-bold px-13 py-2 rounded-lg text-center hover:bg-yellow-600 w-full"
                                                    >
                                                        Edit
                                                    </Link>

                                                    {!a.isArchived && (
                                                        <button
                                                            onClick={() => handleArchive(a.slug)}
                                                            className="text-white font-bold px-10.5 py-2 rounded-lg bg-red-400 hover:bg-red-500 w-full"
                                                        >
                                                            Archive
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}