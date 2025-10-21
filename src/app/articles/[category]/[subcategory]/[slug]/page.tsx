// app/[category]/[subcategory]/[slug]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ArticleRenderer from "../../../../components/ArticleRenderer";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // await nlng
  const { category, subcategory, slug } = await params;

  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("category_slug", category)
    .eq("subcategory_slug", subcategory)
    .single();

  if (error || !article) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ArticleRenderer article={article} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  // await nlng
  const { category, subcategory, slug } = await params;

  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select(
      "title, author, category, subcategory, category_slug, subcategory_slug, thumbnail_url, summary"
    )
    .eq("slug", slug)
    .eq("category_slug", category)
    .eq("subcategory_slug", subcategory)
    .single();

  if (!article) {
    return { title: "Article Not Found" };
  }

  const title = article.title;
  const description =
    article.summary ??
    `By ${article.author}${article.category ? ` - ${article.category}` : ""}${
      article.subcategory ? ` / ${article.subcategory}` : ""
    }`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
      type: "article",
    },
  };
}
