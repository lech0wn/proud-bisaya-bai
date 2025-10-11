import ArticleRenderer from '@/app/components/ArticleRenderer';

async function getArticle(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) {
    return <div className="text-center py-20 text-2xl text-gray-500">Article not found.</div>;
  }
  return <ArticleRenderer article={article} />;
}