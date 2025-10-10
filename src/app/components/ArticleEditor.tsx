'use client';

import React, { useState, useEffect } from 'react';
import { Puck } from '@measured/puck';
import type { Config, Data } from '@measured/puck';
import { useRouter } from 'next/navigation';

/** ---------- Component Types ---------- **/
type HeadingProps = { text: string; level: number };
type ParagraphProps = { text: string };
type ImageBlockProps = { src: string; alt: string };

/** ---------- Puck Config ---------- **/
const components: Config['components'] = {
  Heading: {
    label: 'Heading',
    fields: {
      text: { type: 'text', label: 'Text' },
      level: { type: 'number', label: 'Level', min: 1, max: 6 },
    },
    defaultProps: { text: 'Heading Text', level: 2 },
    render: (props) => {
      const { text, level } = props as unknown as HeadingProps;
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag className="font-bold mb-4">{text}</Tag>;
    },
  },
  Paragraph: {
    label: 'Paragraph',
    fields: { text: { type: 'textarea', label: 'Text' } },
    defaultProps: { text: 'Paragraph text here.' },
    render: (props) => {
      const { text } = props as unknown as ParagraphProps;
      return <p className="mb-4 leading-relaxed">{text}</p>;
    },
  },
  ImageBlock: {
    label: 'Image',
    fields: {
      src: { type: 'text', label: 'Image URL' },
      alt: { type: 'text', label: 'Alt text' },
    },
    defaultProps: { src: '', alt: '' },
    render: (props) => {
      const { src, alt } = props as unknown as ImageBlockProps;
      if (!src) return <div className="mb-4 p-4 bg-gray-100 rounded">No image URL provided</div>;
      return (
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg mb-4 object-cover"
        />
      );
    },
  },
};

const config: Config = { components };

/** ---------- Article Editor Props ---------- **/
interface ArticleEditorProps {
  slug?: string;
}

/** ---------- Article Editor ---------- **/
export default function ArticleEditor({ slug }: ArticleEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!slug);
  const [data, setData] = useState<Data>({
    content: [],
    root: { props: {} },
  });

  const [title, setTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  // Fetch article if editing
  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleSlug}`);
      if (!res.ok) throw new Error('Failed to fetch article');
      
      const article = await res.json();
      
      // Populate form fields
      setTitle(article.title || '');
      setArticleSlug(article.slug || '');
      setAuthor(article.author || '');
      setCategory(article.category || '');
      setSubcategory(article.subcategory || '');
      setThumbnail(article.thumbnail_url || '');
      
      // Parse and set Puck data
      if (article.content) {
        try {
          const parsedContent = typeof article.content === 'string' 
            ? JSON.parse(article.content) 
            : article.content;
          setData(parsedContent);
        } catch (e) {
          console.error('Failed to parse content:', e);
          setData({ content: [], root: { props: {} } });
        }
      }
    } catch (error: any) {
      console.error('Error fetching article:', error);
      alert(`Failed to load article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const s = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setArticleSlug(s);
  };

  const handleSave = async (puckData: Data) => {
    if (!title || !articleSlug || !author || !category) {
      alert('Please fill in all required fields (Title, Slug, Author, Category)');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        slug: articleSlug,
        author,
        category,
        subcategory: subcategory || undefined,
        thumbnail_url: thumbnail || undefined,
        content: JSON.stringify(puckData),
      };

      let res;
      if (slug) {
        // Update existing article
        res = await fetch(`/api/admin/articles/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new article
        res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save article');
      }

      alert(slug ? 'Article updated successfully!' : 'Article published successfully!');
      router.push('/admin/articles');
    } catch (e: any) {
      console.error(e);
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
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Metadata Header - Fixed */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {slug ? 'Edit Article' : 'Create New Article'}
            </h1>
            {!slug && (
              <button
                onClick={generateSlug}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Generate Slug from Title
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={articleSlug}
                onChange={(e) => setArticleSlug(e.target.value)}
                placeholder="article-slug"
                disabled={!!slug}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Technology"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="Optional"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {thumbnail && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Thumbnail Preview:</p>
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="h-32 w-auto object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Puck Editor - Takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <Puck
          config={config}
          data={data}
          onPublish={handleSave}
          onChange={setData}
        />
      </div>

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-8 py-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-900 font-medium">
                {slug ? 'Updating article...' : 'Publishing article...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}