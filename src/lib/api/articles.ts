import { CATEGORIES } from '@/app/components/Categories';

export type CategoryKey = keyof typeof CATEGORIES;
export type SubcategoryValue<T extends CategoryKey> = typeof CATEGORIES[T][number];

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: any;
  author: string;
  category: CategoryKey;
  subcategory?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleInput {
  title: string;
  slug: string;
  content: any;
  author: string;
  category: CategoryKey;
  subcategory?: string;
  thumbnail_url?: string;
}

export const articlesApi = {
  // Get all articles
  getAll: async (params?: {
    category?: CategoryKey;
    subcategory?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.subcategory) queryParams.set('subcategory', params.subcategory);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const res = await fetch(`/api/articles?${queryParams}`);
    if (!res.ok) throw new Error('Failed to fetch articles');
    return res.json();
  },

  // Get single article by slug
  getBySlug: async (slug: string): Promise<Article> => {
    const res = await fetch(`/api/articles/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch article');
    return res.json();
  },

  // Create new article
  create: async (article: ArticleInput): Promise<Article> => {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create article');
    }
    return res.json();
  },

  // Update article
  update: async (slug: string, article: Partial<ArticleInput>): Promise<Article> => {
    const res = await fetch(`/api/articles/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to update article');
    }
    return res.json();
  },

  // Delete article
  delete: async (slug: string) => {
    const res = await fetch(`/api/articles/${slug}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete article');
    }
    return res.json();
  },

  // Upload image
  uploadImage: async (file: File): Promise<{ url: string; path: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to upload image');
    }
    return res.json();
  },

  // Delete image
  deleteImage: async (path: string) => {
    const res = await fetch(`/api/upload-image?path=${encodeURIComponent(path)}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete image');
    }
    return res.json();
  },

  // Get categories
  getCategories: async () => {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }
};