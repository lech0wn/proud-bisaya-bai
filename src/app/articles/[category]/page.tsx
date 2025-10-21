// app/articles/[category]/page.tsx
import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ArticleList from "@/app/components/ArticleList";

type Props = {
  params: { category: string };
  searchParams: { subcategory?: string };
};

const titleize = (slug: string) =>
  slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

export default async function CategoryIndex({ params, searchParams }: Props) {
  const { category } = await params;
  const activeSubcat = searchParams.subcategory || null;

  const supabase = await createClient();

  // Distinct subcategories for this category
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

  // Articles query (filtered by subcategory if present)
  let query = supabase
    .from("articles")
    .select(
      "title, slug, thumbnail_url, created_at, category_slug, subcategory_slug"
    )
    .eq("isPublished", true)
    .eq("isArchived", false)
    .eq("category_slug", category);

  if (activeSubcat) {
    query = query.eq("subcategory_slug", activeSubcat);
  }

  const { data: articlesData, error } = await query.order("created_at", {
    ascending: false,
  });

  const categoryTitle = titleize(category);
  const makeSubcatHref = (slug?: string) =>
    slug
      ? `/articles/${category}?subcategory=${encodeURIComponent(slug)}`
      : `/articles/${category}`;

  return (
    <div>
      <Header />
      <main className="bg-gray-100 py-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {/* Title with optional subcategory breadcrumb */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-black">
              {categoryTitle}
              {activeSubcat && (
                <span className="text-gray-500">
                  {" "}
                  &gt; {titleize(activeSubcat)}
                </span>
              )}
            </h1>
          </div>

          {/* Subcategory section */}
          {!subcatErr && subcategories.length > 0 && (
            <div className="mb-8">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Subcategories
              </div>
              <div className="flex flex-wrap gap-2">
                {/* All chip */}
                <Link
                  href={makeSubcatHref(undefined)}
                  className={`px-3 py-1 rounded-full border text-sm shadow ${
                    !activeSubcat
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All
                </Link>

                {subcategories.map((s) => {
                  const isActive = activeSubcat === s.slug;
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

          {error && (
            <p className="text-red-600 mb-6">Failed to load articles.</p>
          )}

          <ArticleList articles={articlesData || []} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
