import { createClient } from "@/utils/supabase/server";
import ArticlesPageContent from "./ArticlesPageContent";

export default async function ArticlesIndexPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select(
      "id, title, author, created_at, category, subcategory, slug, thumbnail_url, category_slug, subcategory_slug"
    )
    .eq("isPublished", true)
    .eq("isArchived", false)
    .order("created_at", { ascending: false });

  // Categories with subcategories and article counts
  const categories = [
    {
      id: 1,
      label: "Brands",
      slug: "brands",
      count: articles?.filter(a => a.category_slug === "brands").length || 0,
      subcategories: [
        { id: 11, label: "Fashion", slug: "fashion", count: 0 },
        { id: 12, label: "Technology", slug: "technology", count: 0 },
        { id: 13, label: "Automotive", slug: "automotive", count: 0 },
      ]
    },
    {
      id: 2,
      label: "Destinations",
      slug: "destinations",
      count: articles?.filter(a => a.category_slug === "destinations").length || 0,
      subcategories: [
        { id: 21, label: "Beach", slug: "beach", count: 0 },
        { id: 22, label: "Mountain", slug: "mountain", count: 0 },
        { id: 23, label: "City", slug: "city", count: 0 },
      ]
    },
    {
      id: 3,
      label: "Stories",
      slug: "stories",
      count: articles?.filter(a => a.category_slug === "stories").length || 0,
      subcategories: [
        { id: 31, label: "Personal", slug: "personal", count: 0 },
        { id: 32, label: "Community", slug: "community", count: 0 },
        { id: 33, label: "Culture", slug: "culture", count: 0 },
      ]
    },
    {
      id: 4,
      label: "News & Entertainment",
      slug: "news-entertainment",
      count: articles?.filter(a => a.category_slug === "news-entertainment").length || 0,
      subcategories: [
        { id: 41, label: "Local News", slug: "local-news", count: 0 },
        { id: 42, label: "Entertainment", slug: "entertainment", count: 0 },
        { id: 43, label: "Events", slug: "events", count: 0 },
      ]
    },
    {
      id: 5,
      label: "Food",
      slug: "food",
      count: articles?.filter(a => a.category_slug === "food").length || 0,
      subcategories: [
        { id: 51, label: "Restaurants", slug: "restaurants", count: 0 },
        { id: 52, label: "Recipes", slug: "recipes", count: 0 },
        { id: 53, label: "Street Food", slug: "street-food", count: 0 },
      ]
    },
  ];

<<<<<<< HEAD
  // Calculate subcategory counts
  categories.forEach(category => {
    category.subcategories?.forEach(subcategory => {
      subcategory.count = articles?.filter(
        a => a.category_slug === category.slug && a.subcategory_slug === subcategory.slug
      ).length || 0;
    });
  });
=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => {
            const href = `/articles/${article.category_slug}/${article.subcategory_slug}/${article.slug}`;
>>>>>>> ab998a347dc6fac9e850485d63981e40acdfb1a8

  return <ArticlesPageContent articles={articles || []} categories={categories} />;
}