import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ArticleRenderer from "@/app/components/ArticleRenderer";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const rawParams = await params;
  
  const category = decodeURIComponent(rawParams.category);
  const subcategory = decodeURIComponent(rawParams.subcategory);
  const slug = decodeURIComponent(rawParams.slug);
  
  console.log("Decoded params:", { category, subcategory, slug });
  
  const supabase = await createClient();
  
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("category_slug", category)
    .eq("subcategory_slug", subcategory)
    .eq("isPublished", true)
    .eq("isArchived", false)
    .single();

  if (error || !article) {
    console.error("Article not found:", { category, subcategory, slug, error });
    
    const { data: debugData } = await supabase
      .from("articles")
      .select("category_slug, subcategory_slug, slug")
      .eq("slug", slug)
      .eq("category_slug", category);
    
    console.log("Debug - Articles with matching category and slug:", debugData);
    
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
  const rawParams = await params;
  
  const category = decodeURIComponent(rawParams.category);
  const subcategory = decodeURIComponent(rawParams.subcategory);
  const slug = decodeURIComponent(rawParams.slug);
  
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