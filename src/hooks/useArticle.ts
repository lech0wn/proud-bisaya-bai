import { useState, useEffect } from 'react';

export function useArticle(slug?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<any>(null);

  // Fetch article if slug is provided
  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  async function fetchArticle(articleSlug: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${articleSlug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch article');
      setArticle(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function createArticle(articleData: {
    title: string;
    slug: string;
    content: string;
    author: string;
    category: string;
    subcategory?: string;
    thumbnail_url?: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create article');
      setArticle(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateArticle(slug: string, updatedData: Partial<{
    title: string;
    slug: string;
    content: string;
    author: string;
    category: string;
    subcategory?: string;
    thumbnail_url?: string;
  }>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update article');
      setArticle(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle(slug: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete article');
      setArticle(null);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    article,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    loading,
    error,
  };
}