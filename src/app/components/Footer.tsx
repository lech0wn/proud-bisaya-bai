"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white mt-16">
      {/* Top section */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Newsletter */}
          <div>
            <h3 className="text-2xl font-bold">Newsletter</h3>
            <p className="mt-1 text-sm text-gray-300">
              Subscribe to our newsletter and get updated to our hottest news
            </p>

            <form
              className="mt-4 flex max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: handle newsletter subscribe
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full min-w-0 rounded-l-md bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-gray-500"
                required
              />
              <button
                type="submit"
                className="rounded-r-md bg-gray-400 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-300"
              >
                Join
              </button>
            </form>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-4">
              <Link href="#" aria-label="Facebook">
                <Image
                  src="/images/fb_svg.webp"
                  alt="Facebook"
                  width={32}
                  height={32}
                />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Image
                  src="/images/ig_svg.webp"
                  alt="Instagram"
                  width={32}
                  height={32}
                />
              </Link>
              <Link href="#" aria-label="Twitter/X">
                <Image
                  src="/images/twitter_svg.webp"
                  alt="Twitter/X"
                  width={32}
                  height={32}
                />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Image
                  src="/images/yt_svg.webp"
                  alt="YouTube"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
          </div>

          {/* Blogs */}
          <div className="md:mx-auto">
            <h3 className="text-2xl font-bold">Blogs</h3>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:text-white">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Brands & Products
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  News & Entertainment
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Food
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="md:ml-auto">
            <h3 className="text-2xl font-bold">About</h3>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li>
                <Link href="/contact-us" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white">
                  Hire Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy &amp; Support
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white">
                  Be Featured
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-white/20" />

        {/* Bottom row */}
        <div className="mt-4 flex flex-col items-start justify-between gap-2 text-xs text-gray-300 sm:flex-row">
          <span>© {new Date().getFullYear()}, Proud Bisaya Bai</span>
          <span>Powered by JSE | All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
