// app/articles/page.tsx
import { createClient } from "@/utils/supabase/server";
import ArticleSlider from "../components/ArticleSlider";

export default async function ArticlesIndexPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select(
      "id, title, author, created_at, category, subcategory, slug, thumbnail_url, category_slug, subcategory_slug"
    )
    .order("created_at", { ascending: false });

  return <ArticleSlider articles={articles || []} />;
}