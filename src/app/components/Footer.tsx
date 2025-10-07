"use client";

import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-6 mt-8">
      <div className="max-w-5xl mx-auto grid grid-cols-[1.5fr_1.5fr_.5fr] gap-8 items-start">
        {/* Newsletter - left side */}
        <div className="pr-8">
          <h3 className="text-lg font-bold mb-2">
            Subscribe to our Newsletter
          </h3>
          <p className="text-sm mb-4">
            Subscribe to our newsletter and get updated on our hottest news
          </p>
          <form className="flex mb-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-3 py-2 rounded-l-md focus:outline-none text-black bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r bg-gray-400 text-black font-semibold"
            >
              Join
            </button>
          </form>
          <div className="flex gap-4 mt-2">
            {/* Social Media Icons */}
            <Image
              src="/images/fb_svg.png"
              alt="Facebook"
              width={30}
              height={30}
            />
            <Image
              src="/images/ig_svg.png"
              alt="Instagram"
              width={30}
              height={30}
            />
            <Image
              src="/images/twitter_svg.png"
              alt="Twitter/X"
              width={30}
              height={30}
            />
            <Image
              src="/images/yt_svg.png"
              alt="YouTube"
              width={30}
              height={30}
            />
          </div>
        </div>

        {/* About us and Blogs */}
        <div className="grid grid-cols-2 gap-8 justify-end text-right">
          <div>
            <h3 className="text-lg font-bold mb-2">Blogs</h3>
            <ul className="space-y-1 text-gray-300">
              <li>Brands</li>
              <li>Stories</li>
              <li>Destination</li>
              <li>Food</li>
              <li>News and Entertainment</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">About</h3>
            <ul className="space-y-1 text-gray-300">
              <li>About Us</li>
              <li>Hire Us</li>
              <li>Contact</li>
              <li>Privacy & Support</li>
              <li>Be Featured</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
