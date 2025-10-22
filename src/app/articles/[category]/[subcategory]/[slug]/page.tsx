import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ArticleRenderer from "@/app/components/ArticleRenderer";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

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
    <>
      <Header />
      <div className="flex max-w-[1400px] mx-auto px-6 py-12 gap-6 bg-gray-50 min-h-screen">
        {/* Left Ad */}
        <aside className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-6 bg-gray-200 rounded-lg p-8 h-[600px] flex items-center justify-center">
            <span className="text-gray-500 font-semibold">Ads Here</span>
          </div>
        </aside>

        {/* Main Article Content */}
        <main className="flex-1 bg-white rounded-lg shadow-md p-6">
          <ArticleRenderer article={article} />
        </main>

        {/* Right Ad */}
        <aside className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-6 bg-gray-200 rounded-lg p-8 h-[600px] flex items-center justify-center">
            <span className="text-gray-500 font-semibold">Ads Here</span>
          </div>
        </aside>
      </div>
      <Footer />
    </>
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
