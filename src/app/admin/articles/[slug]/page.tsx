// app/articles/[slug]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ArticleRenderer from '../../../components/ArticleRenderer';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleRenderer article={article} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('title, author, category, thumbnail_url')
    .eq('slug', params.slug)
    .single();

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: `By ${article.author} - ${article.category}`,
    openGraph: {
      title: article.title,
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
    },
  };
}