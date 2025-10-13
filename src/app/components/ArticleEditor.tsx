'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Puck } from '@measured/puck';
import type { Config, Data } from '@measured/puck';
import { useRouter } from 'next/navigation';

/** ---------- Categories ---------- **/
const CATEGORIES = {
  "Destinations": ["Cebu Highlights", "Beaches & Islands", "Mountain Escapes", "Heritage & History", "Hidden Gems", "Travel Itineraries"],
  "Brands and Products": ["Homegrown Brands", "Fashion & Apparel", "Tech & Gadgets", "Beauty & Wellness", "Food Products", "Eco-Friendly & Sustainable"],
  "Stories": ["Life in Cebu", "Resilience & Recovery", "Student Stories", "Entrepreneur Journeys", "Cultural Narratives", "Inspirational Profiles"],
  "News and Entertainment": ["Breaking News Cebu", "Local Governance", "Festivals & Events", "Entertainment Buzz", "Music & Arts", "Sports", "Campus News"],
  "Food": ["Cebu Favorites", "Street Food Finds", "Café & Coffee Spots", "Seafood Specials", "Sweet Treats & Desserts", "Food Reviews"]
};

/** ---------- Component Types ---------- **/
type HeadingProps = { text: string; level: number };
type ParagraphProps = { text: string };
type ImageBlockProps = { src: string; alt: string; caption?: string };

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
      caption: { type: 'text', label: 'Caption (optional)' },
    },
    defaultProps: { src: '', alt: '', caption: '' },
    render: (props) => {
      const { src, alt, caption } = props as unknown as ImageBlockProps;
      if (!src) return <div className="mb-4 p-4 bg-gray-100 rounded text-gray-500 text-center">Click to add image URL or upload below</div>;
      return (
        <figure className="mb-4">
          <img
            src={src}
            alt={alt}
            className="w-full rounded-lg object-cover"
          />
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

/** ---------- Article Editor Props ---------- **/
interface ArticleEditorProps {
  slug?: string;
}

/** ---------- Article Editor ---------- **/
export default function ArticleEditor({ slug }: ArticleEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!slug);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  
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

  const availableSubcategories = category ? CATEGORIES[category as keyof typeof CATEGORIES] || [] : [];

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
      
      setTitle(article.title || '');
      setArticleSlug(article.slug || '');
      setAuthor(article.author || '');
      setCategory(article.category || '');
      setSubcategory(article.subcategory || '');
      setThumbnail(article.thumbnail_url || '');
      
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

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    
    return data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      
      // Copy URL to clipboard
      await navigator.clipboard.writeText(imageUrl);
      alert(`Image uploaded successfully!\nURL copied to clipboard:\n${imageUrl}\n\nPaste this URL into the Image Block's "Image URL" field.`);
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const imageUrl = await uploadImage(file);
      setThumbnail(imageUrl);
      alert('Thumbnail uploaded successfully!');
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (puckData: Data) => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!articleSlug.trim()) {
      alert('Please enter a slug');
      return;
    }
    if (!author.trim()) {
      alert('Please enter an author name');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: articleSlug.trim(),
        author: author.trim(),
        category: category,
        subcategory: subcategory || undefined,
        thumbnail_url: thumbnail.trim() || undefined,
        content: JSON.stringify(puckData),
      };

      let res;
      if (slug) {
        res = await fetch(`/api/admin/articles/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to save article');
      }

      alert(slug ? 'Article updated successfully!' : 'Article published successfully!');
      router.push('/admin/dashboard');
    } catch (e: any) {
      console.error('Save error:', e);
      alert(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (category && !availableSubcategories.includes(subcategory)) {
      setSubcategory('');
    }
  }, [category]);

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
      {/* Metadata Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-blue-600 hover:underline text-sm mb-2 inline-block"
              >
                ← Back to Articles
              </button>
              <h1 className="text-2xl text-black font-bold">
                {slug ? 'Edit Article' : 'Create New Article'}
              </h1>
            </div>
            <div className="flex gap-2">
              {!slug && (
                <button
                  onClick={generateSlug}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Generate Slug
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : '📤 Upload Image'}
              </button>
            </div>
          </div>
          
          {/* Hidden file input for content images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="" className="text-gray-400">Select a category</option>
                {Object.keys(CATEGORIES).map((cat) => (
                  <option key={cat} value={cat} className="text-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!category}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
              >
                <option value="" className="text-gray-400">Select a subcategory (optional)</option>
                {availableSubcategories.map((subcat) => (
                  <option key={subcat} value={subcat} className="text-gray-900">
                    {subcat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="Or paste URL"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={uploadingThumbnail}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {uploadingThumbnail ? '...' : '📤'}
                </button>
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
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

          {/* Upload Instructions */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 How to add images:</strong> Click "Upload Image" button above, select your image, and the URL will be copied to your clipboard. Then paste it into the Image Block's "Image URL" field in the editor below.
            </p>
          </div>
        </div>
      </div>

      {/* Puck Editor */}
      <div className="flex-1 overflow-hidden">
        <Puck
          config={config}
          data={data}
          onPublish={handleSave}
          onChange={setData}
        />
      </div>

      {/* Loading Overlays */}
      {(saving || uploading || uploadingThumbnail) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-8 py-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-900 font-medium">
                {saving && (slug ? 'Updating article...' : 'Publishing article...')}
                {uploading && 'Uploading image...'}
                {uploadingThumbnail && 'Uploading thumbnail...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}