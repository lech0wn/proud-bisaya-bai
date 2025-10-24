import Head from "next/head";
import React from "react";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import LatestUpdateCard from "../components/LatestUpdateCard";
import { createClient } from "@/utils/supabase/server";

const Home: React.FC = async () => {
  const stories = [
    {
      title: "Destinations",
      image: "/images/destinations_image.webp",
      slug: "destinations",
    },
    {
      title: "News and Entertainment",
      image: "/images/news_image.webp",
      slug: "news-and-entertainment",
    },
    {
      title: "Food",
      image: "/images/food_image.webp",
      slug: "food",
    },
    {
      title: "Brands and Products",
      image: "/images/brands_image.webp",
      slug: "brands-and-products",
    },
    {
      title: "Stories",
      image: "/images/stories_image.webp",
      slug: "stories",
    },
  ];

  const supabase = await createClient();
  const { data: articlesData } = await supabase
    .from("articles")
    .select(
      "title, slug, thumbnail_url, created_at, author, category, subcategory, category_slug, subcategory_slug"
    )
    .eq("isPublished", true)
    .eq("isArchived", false) //exclude archived posts
    .order("created_at", { ascending: false })
    .limit(8);

  const breakingNews = [
    {
      title: "Cebu City Mayor Announces NEW BRT",
      time: "10:15 AM",
    },
    {
      title: "TRAFFIC ALERT: Flooding in N. Busay Road",
      time: "10:15 AM",
    },
  ];

  const editorsPicks = [
    {
      title: "Why Marine Life is Worth Saving",
      date: "Sept 27, 2025",
      image: "/images/pick1.jpg",
    },
    {
      title: "The One That Connects",
      date: "Sept 27, 2025",
      image: "/images/pick2.jpg",
    },
    {
      title: "Money Knows Best",
      date: "Sept 27, 2025",
      image: "/images/pick3.jpg",
    },
  ];

  return (
    <div>
      <Head>
        <title>Proud Bisaya Bai</title>
        <meta
          name="description"
          content="Your daily guide to the best of Central Visayas."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Header */}
        <Header />
        {/* Hero Banner */}
        <div
          className="relative h-screen bg-cover bg-center "
          style={{ backgroundImage: "url('/images/banner.webp')" }}
        >
          {
            /* Overlay (not sure about the opacity for now)*/
            <div className="absolute inset-0 bg-black/40"></div>
          }
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-9xl md:text-10xl font-bold bg-gradient-to-r from-[var(--custom-orange)] to-[var(--custom-orange)] bg-clip-text text-transparent leading-tight">
              Proud Bisaya Bai
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">
              Your daily guide to the best of Central Visayas. Discover
              authentic Bisaya food, travel routes, and stories from Cebu and
              beyond.
            </p>
            <Link href="/contact-us">
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] text-white font-semibold rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl active:scale-95">
                Get Featured
              </button>
            </Link>
          </div>
        </div>

        {/* Featured Stories */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            {/* Section Title */}
            <h2 className="text-3xl font-bold text-center mb-8 text-black">
              Featured Stories
            </h2>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stories.map((story, index) => (
                <Link
                  key={index}
                  href={`/articles/${story.slug}`}
                  className="relative h-40 bg-cover bg-center rounded-lg shadow-lg group block"
                  style={{ backgroundImage: `url(${story.image})` }}
                >
                  <span className="absolute inset-0 bg-black/40 rounded-lg group-hover:bg-black/60 transition-colors" />
                  <span className="relative z-10 flex h-full items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">
                      {story.title}
                    </h3>
                  </span>
                </Link>
              ))}
            </div>

            {/* Articles */}
            {/* Section Title */}
            <h2 className="text-3xl font-bold text-center mb-8 text-black">
              All Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
              {(articlesData || []).slice(0, 4).map((article) => {
                const href = `/articles/${article.category_slug}/${article.subcategory_slug}/${article.slug}`;
                return (
                  <Link
                    key={article.slug}
                    href={href}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={article.thumbnail_url || "/images/banner.webp"}
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
            <Link
              href="/articles"
              className="flex items-center justify-center py-8 underline text-lg text-gray-600 hover:text-gray-400"
            >
              See all articles
            </Link>
          </div>
        </div>

        {/* Breaking News */}
        <section className="bg-white py-8">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-4 text-black">Breaking News</h2>
            <div className="bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] p-4 rounded-lg shadow-md">
              {breakingNews.map((news, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2 last:mb-0"
                >
                  <p className="text-white font-semibold">{news.title}</p>
                  <p className="text-white font-bold">{news.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Latest Updates */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-black">
                  Karon: Latest Updates and News
                </h3>
                {(articlesData || []).slice(0, 3).map((article, index) => (
                  <LatestUpdateCard
                    key={index}
                    image={article.thumbnail_url || "/images/articles.webp"}
                    title={article.title}
                    date={new Date(article.created_at).toLocaleDateString()}
                    author={article.author}
                  />
                ))}
              </div>

              {/* Editor's Picks */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-black">
                  Editor's Picks
                </h3>
                <h3 className="text-sm mb-4 text-gray-400">
                  No articles found.
                </h3>
                {/* {editorsPicks.map((pick, index) => (
                  <LatestUpdateCard
                    key={index}
                    image={pick.image}
                    title={pick.title}
                    date={pick.date}
                  />
                ))} */}
              </div>
            </div>
          </div>
        </section>

        {/* Our Partners Section */}
        <section className="bg-gray-100 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-lg font-bold mb-4 text-black">Our Partners</h3>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              {/* Partner Logos */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/cebuhomepages.webp"
                  alt="Cebu Home Pages Logo"
                  className="w-20 h-20 object-contain"
                />
                <p className="text-sm text-gray-700 mt-2">Cebu Home Pages</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/lalamove.webp"
                  alt="Lalamove Logo"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <p className="text-sm text-gray-700 mt-2">Lalamove</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/jse.webp"
                  alt="JSE Logo"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <p className="text-sm text-gray-700 mt-2">JSE</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ads Section */}
        <section className="bg-gray-200 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-lg font-semibold">
                ADS HERE
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
