"use client";

import React, { useState, useMemo } from "react";
import CategorySidebar from "../components/sidebar";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Link from "next/link";
import Image from "next/image";

export default function ArticlesPageContent({ articles, categories }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState<
    string | undefined
  >(undefined);
  const [displayCount, setDisplayCount] = useState(8);

  // Filter articles based on selected category and subcategory
  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") {
      return articles;
    }

    let filtered = articles.filter(
      (article: any) => article.category_slug === activeCategory
    );

    if (activeSubcategory) {
      filtered = filtered.filter(
        (article: any) => article.subcategory_slug === activeSubcategory
      );
    }

    return filtered;
  }, [articles, activeCategory, activeSubcategory]);

  // Handle category selection from sidebar
  const handleCategorySelect = (
    categorySlug: string,
    subcategorySlug?: string
  ) => {
    setActiveCategory(categorySlug);
    setActiveSubcategory(subcategorySlug);
    setDisplayCount(8); // Reset display count when filter changes
  };

  // Get current filter title
  const getFilterTitle = () => {
    if (activeCategory === "all") return "All Articles";

    const category = categories.find((c: any) => c.slug === activeCategory);
    if (!category) return "All Articles";

    if (activeSubcategory) {
      const subcategory = category.subcategories?.find(
        (s: any) => s.slug === activeSubcategory
      );
      return subcategory
        ? `${category.label} - ${subcategory.label}`
        : category.label;
    }

    return category.label;
  };

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayCount < filteredArticles.length;

  const loadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Sidebar Toggle Button - Hidden when sidebar is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 left-5 z-50 bg-white p-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          title="Open sidebar"
        >
          <Image
            src="/filter.svg"
            alt="Menu"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      )}

      {/* Overlay - click to close sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <CategorySidebar
        isOpen={isOpen}
        categories={categories}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
      />

      {/* Main Content */}
      <div className="pt-14">
        {/* Articles Grid */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{getFilterTitle()}</h1>
            <p className="text-gray-600">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "article" : "articles"} found
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No articles found in this category.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveSubcategory(undefined);
                  setDisplayCount(8);
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Articles
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedArticles.map((article: any, index: number) => {
                  const href = `/articles/${article.category_slug}/${article.subcategory_slug}/${article.slug}`;

                  // Insert ad after every 6 articles
                  const showAdAfter =
                    (index + 1) % 6 === 0 &&
                    index !== displayedArticles.length - 1;

                  return (
                    <React.Fragment key={article.id}>
                      <Link href={href} className="group">
                        <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                          {article.thumbnail_url && (
                            <div className="overflow-hidden h-48">
                              <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex gap-2 mb-3 flex-wrap">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {article.category}
                              </span>
                              {article.subcategory && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  {article.subcategory}
                                </span>
                              )}
                            </div>
                            <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                              {article.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                              By {article.author} •{" "}
                              {new Date(
                                article.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </article>
                      </Link>

                      {/* In-feed Ad - appears after every 6 articles */}
                      {showAdAfter && (
                        <div className="md:col-span-2 lg:col-span-3">
                          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm max-w-3xl mx-auto">
                            {/* <img
                              src="/images/ads_placeholder.webp"
                              alt="Advertisement"
                              className="w-full h-24 object-cover"
                            /> */}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-8 mt-6">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Load More Articles
                  </button>
                </div>
              )}

              {/* Showing count */}
              <div className="text-center text-sm text-gray-600 pt-4 pb-6">
                Showing {displayedArticles.length} of {filteredArticles.length}{" "}
                articles
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
