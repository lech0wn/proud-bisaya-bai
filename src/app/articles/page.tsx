import { createClient } from "@/utils/supabase/server";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Link from "next/link";

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

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">All Articles</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => {
            const href = `/articles/${article.category_slug}/${article.subcategory_slug}/${article.slug}`;

            return (
              <Link key={article.id} href={href} className="group">
                <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  {article.thumbnail_url && (
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {article.category}
                      </span>
                      {article.subcategory && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {article.subcategory}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      By {article.author} •{" "}
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
