import Head from "next/head";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

const Home: React.FC = () => {
  const stories = [
    {
      title: "News",
      image: "/images/news.jpg",
    },
    {
      title: "Travel and Destination",
      image: "/images/travel.jpg",
    },
    {
      title: "Food and Culture",
      image: "/images/food.jpg",
    },
  ];

  const articles = [
    {
      title: "45 Minutes Nalang Mu-Adto Sa Bantayan",
      date: "Sept 17, 2025",
      image: "/images/story1.jpg",
    },
    {
      title: "Proweaver Contest Puts Cebuano Talent on the Map",
      date: "Sept 25, 2025",
      image: "/images/story2.jpg",
    },
    {
      title: "Typhoon Safety Reminders: Stay Prepared, Stay Safe",
      date: "Sept 30, 2025",
      image: "/images/story3.jpg",
    },
    {
      title: "Slice, Slice, Baby! Domino’s 5-Day Pizza Sale Hits Cebu",
      date: "Oct 1, 2025",
      image: "/images/story4.jpg",
    },
  ];

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

  const latestUpdates = [
    {
      title: "Cebu Celebrates Sinulog",
      date: "Sept 27, 2025",
      image: "/images/latest1.jpg",
    },
    {
      title: "Happy New Year Cebu!",
      date: "Sept 27, 2025",
      image: "/images/latest2.jpg",
    },
    {
      title: "Car Crash at Medellin",
      date: "Sept 27, 2025",
      image: "/images/latest3.jpg",
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
          style={{ backgroundImage: "url('/images/hero_image.webp')" }}
        >
          {/* Overlay
          <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              Proud <span className="text-orange-500">Bisaya Bai</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">
              Your daily guide to the best of Central Visayas. Discover
              authentic Bisaya food, travel routes, and stories from Cebu and
              beyond.
            </p>
            <button className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg">
              Get Featured
            </button>
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
                <div
                  key={index}
                  className="relative h-40 bg-cover bg-center rounded-lg shadow-lg"
                  style={{ backgroundImage: `url(${story.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">
                      {story.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
              {articles.map((article, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">{article.title}</h4>
                    <p className="text-sm text-gray-500">{article.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breaking News */}
        <section className="bg-white py-8">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-4 text-black">Breaking News</h2>
            <div className="bg-yellow-400 p-4 rounded-lg shadow-md">
              {breakingNews.map((news, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2 last:mb-0"
                >
                  <p className="text-black font-semibold">{news.title}</p>
                  <p className="text-black font-bold">{news.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Updates and Editor's Picks */}
        <section className="bg-gray-100 py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Latest Updates */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-black">
                Karon: Latest Updates and News
              </h3>
              {latestUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={update.image}
                    alt={update.title}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h4 className="text-black font-semibold">{update.title}</h4>
                    <p className="text-gray-500 text-sm">{update.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Editor's Picks */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-black">
                Editor's Picks
              </h3>
              {editorsPicks.map((pick, index) => (
                <div
                  key={index}
                  className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={pick.image}
                    alt={pick.title}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h4 className="text-black font-semibold">{pick.title}</h4>
                    <p className="text-gray-500 text-sm">{pick.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Partners Section */}
        <section className="bg-gray-100 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-lg font-bold mb-4 text-black">Our Partners</h3>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              {/* Partner Logos */}
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center"
                >
                  {/* Placeholder for Partner Logo */}
                  <span className="text-gray-500">Logo</span>
                </div>
              ))}
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
