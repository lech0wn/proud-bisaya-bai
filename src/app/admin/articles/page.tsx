'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Article = {
  id: string;
  slug: string;
  title: string;
  author?: string;
  category?: string;
  subcategory?: string;
  created_at?: string;
  thumbnail_url?: string;
};

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchArticles(); }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/articles');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON from server');
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
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link
          href="/admin/articles/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          + New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <p className="text-black mb-4">No articles found.</p>
          <Link
            href="/admin/articles/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create One
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {a.thumbnail_url && (
                    <img
                      src={a.thumbnail_url}
                      alt={a.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-xl font-semibold mb-2 truncate">{a.title}</h2>
                  <div className="flex flex-wrap gap-2 text-sm text-black mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">{a.author ?? 'Unknown'}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{a.category ?? 'Uncategorized'}</span>
                    {a.subcategory && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {a.subcategory}
                      </span>
                    )}
                  </div>
                  {a.created_at && (
                    <p className="text-sm text-black">
                      Created: {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/admin/articles/${a.slug}/edit`}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a.slug)}
                    className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
