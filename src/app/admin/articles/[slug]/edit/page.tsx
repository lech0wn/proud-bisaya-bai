'use client';
import { use } from 'react';
import ArticleEditor from '../../../../components/ArticleEditor';


interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = use(params) as { slug: string };
  return <ArticleEditor slug={slug} />;
}