'use client';
import ArticleEditor from '../../../../components/ArticleEditor';

interface EditArticlePageProps {
  params: {
    slug: string;
  };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  return <ArticleEditor slug={params.slug} />;
}