'use client';
import { useState, useEffect } from 'react';
import { articlesApi, Article, CategoryKey } from '@/lib/api/articles';

export function useArticles(params?: {
  category?: CategoryKey;
  subcategory?: string;
  page?: number;
  limit?: number;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articlesApi.getAll(params);
        setArticles(data.articles);
        setPagination({
          total: data.total,
          page: data.page,
          totalPages: data.totalPages
        });
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [params?.category, params?.subcategory, params?.page, params?.limit]);

  return { articles, loading, error, pagination };
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await articlesApi.getBySlug(slug);
        setArticle(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  return { article, loading, error };
}