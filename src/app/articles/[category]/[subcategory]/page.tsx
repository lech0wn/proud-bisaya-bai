import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

type Props = { params: { category: string; subcategory: string } };

const titleize = (slug: string) =>
  slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await params;
  const supabase = await createClient();

  const { data: articlesData, error } = await supabase
    .from("articles")
    .select(
      "title, slug, thumbnail_url, created_at, category_slug, subcategory_slug"
    )
    .eq("isPublished", true)
    .eq("isArchived", false)
    .eq("category_slug", category)
    .eq("subcategory_slug", subcategory)
    .order("created_at", { ascending: false });

  const title = `${titleize(category)} • ${titleize(subcategory)}`;

  return (
    <div>
      <Header />
      <main className="bg-gray-100 py-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-black">{title}</h1>

          {error && <p className="text-red-600">Failed to load subcategory.</p>}

          {!articlesData?.length && !error ? (
            <p className="text-gray-600">
              No articles found in this subcategory.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
              {(articlesData || []).map((article) => {
                const href = `/articles/${article.category_slug}/${article.subcategory_slug}/${article.slug}`;
                return (
                  <Link
                    key={article.slug}
                    href={href}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={article.thumbnail_url || "/images/articles.webp"}
                      alt={article.title}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
