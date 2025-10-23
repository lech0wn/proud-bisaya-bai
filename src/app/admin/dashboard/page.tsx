"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
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
};

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [createdDateFrom, setCreatedDateFrom] = useState("");
  const [createdDateTo, setCreatedDateTo] = useState("");
  const [updatedDateFrom, setUpdatedDateFrom] = useState("");
  const [updatedDateTo, setUpdatedDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

      if (Array.isArray(data)) setArticles(data);
      else if (Array.isArray(data.articles)) setArticles(data.articles);
      else if (Array.isArray(data.data)) setArticles(data.data);
      else setArticles([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(slug: string) {
    if (!confirm("Publish this article?")) return;
    try {
      const res = await fetch(`/api/admin/articles/${slug}/publish`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to publish");
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleUnpublish(slug: string) {
    if (!confirm("Unpublish this article? It will return to pending status.")) return;
    try {
      const res = await fetch(`/api/admin/articles/${slug}/unpublish`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to unpublish");
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleArchive(slug: string) {
    if (!confirm("Archive this article?")) return;
    try {
      const res = await fetch(`/api/admin/articles/${slug}/archive`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to archive");
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleUnarchive(slug: string) {
    if (!confirm("Unarchive this article? It will return to its previous state.")) return;
    try {
      const res = await fetch(`/api/admin/articles/${slug}/unarchive`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to unarchive");
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Get unique categories and subcategories
  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean))).sort();
  const subcategories = Array.from(new Set(articles.map(a => a.subcategory).filter(Boolean))).sort();

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setCreatedDateFrom("");
    setCreatedDateTo("");
    setUpdatedDateFrom("");
    setUpdatedDateTo("");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory || selectedSubcategory || 
    createdDateFrom || createdDateTo || updatedDateFrom || updatedDateTo;

  const filteredArticles = articles.filter((article) => {
    // Tab filter
    if (activeTab === "pending") {
      if (article.isPublished || article.isArchived) return false;
    } else if (activeTab === "archived") {
      if (!article.isArchived) return false;
    } else if (activeTab === "published") {
      if (!article.isPublished || article.isArchived) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = article.title?.toLowerCase().includes(query);
      const matchesAuthor = article.author?.toLowerCase().includes(query);
      const matchesCategory = article.category?.toLowerCase().includes(query);
      const matchesSubcategory = article.subcategory?.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesAuthor && !matchesCategory && !matchesSubcategory) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory && article.category !== selectedCategory) {
      return false;
    }

    // Subcategory filter
    if (selectedSubcategory && article.subcategory !== selectedSubcategory) {
      return false;
    }

    // Created date filter
    if (createdDateFrom && article.created_at) {
      const articleDate = new Date(article.created_at).setHours(0, 0, 0, 0);
      const fromDate = new Date(createdDateFrom).setHours(0, 0, 0, 0);
      if (articleDate < fromDate) return false;
    }
    if (createdDateTo && article.created_at) {
      const articleDate = new Date(article.created_at).setHours(0, 0, 0, 0);
      const toDate = new Date(createdDateTo).setHours(0, 0, 0, 0);
      if (articleDate > toDate) return false;
    }

    // Updated date filter
    if (updatedDateFrom && article.updated_at) {
      const articleDate = new Date(article.updated_at).setHours(0, 0, 0, 0);
      const fromDate = new Date(updatedDateFrom).setHours(0, 0, 0, 0);
      if (articleDate < fromDate) return false;
    }
    if (updatedDateTo && article.updated_at) {
      const articleDate = new Date(article.updated_at).setHours(0, 0, 0, 0);
      const toDate = new Date(updatedDateTo).setHours(0, 0, 0, 0);
      if (articleDate > toDate) return false;
    }

    return true;
  });

  // Count active filters
  const activeFilterCount = [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    createdDateFrom,
    createdDateTo,
    updatedDateFrom,
    updatedDateTo
  ].filter(Boolean).length;

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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 flex items-center justify-between">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "pending"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending Posts
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "archived"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Archived Posts
              </button>
              <button
                onClick={() => setActiveTab("published")}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "published"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Published Posts
              </button>
            </div>
            <div className="flex gap-3 px-6">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 text-white font-bold px-4 py-2 rounded transition-colors ${
                  hasActiveFilters 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <Link
                href="/admin/articles/new/metadata"
                className="bg-red-500 flex items-center gap-2 text-white font-bold px-4 py-2 rounded transition-colors hover:bg-red-600 active:bg-red-700"
              >
                Add Article
              </Link>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border-b border-gray-200 bg-gray-50 p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                  >
                    <option value="">All Subcategories</option>
                    {subcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Created Date</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        value={createdDateFrom}
                        onChange={(e) => setCreatedDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        value={createdDateTo}
                        onChange={(e) => setCreatedDateTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Updated Date</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        value={updatedDateFrom}
                        onChange={(e) => setUpdatedDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        value={updatedDateTo}
                        onChange={(e) => setUpdatedDateTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredArticles.length}</span> of <span className="font-semibold text-gray-900">{articles.filter((article) => {
                if (activeTab === "pending") return !article.isPublished && !article.isArchived;
                if (activeTab === "archived") return article.isArchived;
                if (activeTab === "published") return article.isPublished && !article.isArchived;
                return false;
              }).length}</span> articles
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-600 mb-4">
                {hasActiveFilters ? "No articles match your filters." : "No articles found. Feel free to generate!"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="w-1/6 px-4 py-3 font-bold text-gray-900 text-center align-middle bg-gray-50">
                      Cover
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
                      <td className="px-4 py-3 text-sm text-gray-900 text-center align-middle border-b border-gray-200">
                        {a.thumbnail_url && (
                          <img
                            src={a.thumbnail_url}
                            alt={a.title}
                            className="mx-auto h-28 object-cover rounded-lg mb-2"
                          />
                        )}
                        {a.created_at && (
                          <div className="text-xs text-gray-600">
                            Created: {new Date(a.created_at).toLocaleDateString()}
                          </div>
                        )}
                        {a.updated_at && (
                          <div className="text-xs text-gray-500">
                            Updated: {new Date(a.updated_at).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center align-middle border-b border-gray-200">
                        {a.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center align-middle border-b border-gray-200">
                        {a.author}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center align-middle border-b border-gray-200">
                        {a.status ?? "no status:("}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center align-middle border-b border-gray-200">
                        {a.category ?? "Uncategorized"}
                        {a.subcategory && (
                          <span className="block text-xs text-gray-500">
                            {a.subcategory}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center align-middle border-b border-gray-200">
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
                            href={`/admin/articles/${a.slug}`}
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