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
  const { category, subcategory } = params;
  const supabase = await createClient();

  // 1) Build the subcategory chips (same logic as category page)
  const { data: subcatsRaw, error: subcatErr } = await supabase
    .from("articles")
    .select("subcategory, subcategory_slug")
    .eq("isPublished", true)
    .eq("isArchived", false)
    .eq("category_slug", category);

  const subcatMap = new Map<string, { label: string; slug: string }>();
  (subcatsRaw || []).forEach((row) => {
    const slug = row.subcategory_slug;
    const label = row.subcategory || row.subcategory_slug;
    if (slug && !subcatMap.has(slug)) subcatMap.set(slug, { label, slug });
  });
  const subcategories = Array.from(subcatMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const makeSubcatHref = (slug?: string) =>
    slug ? `/articles/${category}/${slug}` : `/articles/${category}`;

  // 2) Fetch articles for this subcategory
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

          {/* Subcategory chips (visible on subcategory page too) */}
          {!subcatErr && subcategories.length > 0 && (
            <div className="mb-8">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Subcategories
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={makeSubcatHref(undefined)}
                  className={`px-3 py-1 rounded-full border text-sm shadow ${
                    // When on subcategory route, "All" is not active
                    "bg-white text-black border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All
                </Link>

                {subcategories.map((s) => {
                  const isActive = s.slug === subcategory;
                  return (
                    <Link
                      key={s.slug}
                      href={makeSubcatHref(s.slug)}
                      className={`px-3 py-1 rounded-full border text-sm shadow ${
                        isActive
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

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
