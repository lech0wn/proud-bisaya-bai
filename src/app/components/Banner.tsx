import React from "react"

const Banner: React.FC = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero_image.webp')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold">
          Proud <span className="text-orange-500">Bisaya Bai</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Your daily guide to the best of Central Visayas. Discover authentic
          Bisaya food, travel routes, and stories from Cebu and beyond.
        </p>
        <button className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg">
          Get Featured
        </button>
      </div>
    </div>
  )
}

export default Banner
