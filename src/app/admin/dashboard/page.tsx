"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MoreVertical } from "lucide-react";
import AdminHeader from "@/app/components/AdminHeader";

type Article = {
  id: string;
  slug: string;
  title: string;
  author?: string;
  category?: string;
  subcategory?: string;
  created_at?: string;
  thumbnail_url?: string;
  status?: string;
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

      const res = await fetch("/api/articles");
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

  async function handleDelete(slug: string) {
    if (!confirm("Delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchArticles();
    } catch (err: any) {
      alert(err.message);
    }
  }

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
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "pending"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending Posts
              </button>
              <button
                onClick={() => setActiveTab("deleted")}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "deleted"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Deleted Posts
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "approved"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Approved Posts
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
          {articles.length === 0 ? (
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
                  {articles.map((a) => (
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
                            : {a.subcategory}
                          </span>
                        )}
                      </td>
                      <td className="w-1/6 px-4 py-3 text-m text-gray-900 text-center align-middle border-b border-gray-200">
                        <div className="flex flex-col gap-1 items-center">
                          <button
                            onClick={() => handleDelete(a.slug)}
                            className="text-white font-bold px-10 py-2 rounded-lg bg-gray-400"
                          >
                            Publish
                          </button>
                          <Link
                            href={`/articles/${a.slug}`}
                            target="_blank"
                            className="bg-green-500 text-white font-bold px-12 py-2 rounded-lg text-center"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/articles/${a.slug}/metadata`}
                            className="bg-blue-500 text-white font-bold px-13 py-2 rounded-lg text-center"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(a.slug)}
                            className="text-white font-bold px-10.5 py-2 rounded-lg bg-red-400"
                          >
                            Delete
                          </button>
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
