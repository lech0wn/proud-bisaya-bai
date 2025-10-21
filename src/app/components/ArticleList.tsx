// app/components/ArticleList.tsx
import Link from "next/link";

type ArticleCard = {
  slug: string;
  title: string;
  thumbnail_url?: string | null;
  created_at: string;
  category_slug: string;
  subcategory_slug: string;
};

export default function ArticleList({ articles }: { articles: ArticleCard[] }) {
  if (!articles?.length) {
    return <p className="text-gray-600">No articles found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
      {articles.map((article) => {
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
  );
}
