"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  // Optional: make it explicit instead of relying on position
  // type?: "core" | "category";
};

const defaultItems: NavItem[] = [
  { label: "Home", href: "/home" },
  { label: "Articles", href: "/articles" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Destinations", href: "/articles/destinations" },
  { label: "Stories", href: "/articles/stories" },
  { label: "Food", href: "/articles/food" },
  { label: "Brands and Products", href: "/articles/brands-and-products" },
  { label: "News and Entertainment", href: "/articles/news-and-entertainment" },
];

export default function Navbar({
  items = defaultItems,
}: {
  items?: NavItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Split into core vs categories. We treat everything from "Destinations" onward as categories.
  const { coreItems, categoryItems } = useMemo(() => {
    const idx = items.findIndex(
      (i) => i.label.toLowerCase() === "destinations"
    );
    if (idx === -1) {
      return { coreItems: items, categoryItems: [] as NavItem[] };
    }
    return { coreItems: items.slice(0, idx), categoryItems: items.slice(idx) };
  }, [items]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const width = isOpen ? "240px" : "0px";
      document.documentElement.style.setProperty("--sidebar-width", width);
    }
  }, [isOpen]);

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
          </div>

          {/* Burger Menu */}
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((v) => !v)}
            className="rounded p-2 text-xl hover:bg-gray-100"
            title={isOpen ? "Close" : "Open"}
          >
            <img
              src="/images/burger.webp"
              alt={isOpen ? "Close menu" : "Open menu"}
              width={30}
              height={30}
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>

      {/* Sidebar Nav */}
      <aside
        className="fixed top-0 right-0 h-screen z-50 bg-white border-l border-gray-200 shadow-lg"
        style={{
          width: isOpen ? 260 : 0,
          overflow: "hidden",
          transition: "width 200ms ease",
        }}
      >
        {isOpen && (
          <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-white">
              <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-700">
                  Menu
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setIsOpen(false)}
                  className="rounded p-2 text-xl text-black hover:text-black hover:bg-gray-200"
                  title="Close"
                >
                  <img
                    src="/images/close.webp"
                    alt="Close menu"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                </button>
              </div>
            </div>

            <nav className="px-2 py-3 overflow-y-auto flex-1">
              {/* Core links */}
              <div className="space-y-1">
                {coreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded px-3 py-2 text-sm text-black font-bold hover:bg-gray-100"
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Categories section */}
              {categoryItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="px-3 mb-2">
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Categories
                    </span>
                  </div>
                  <div className="space-y-1">
                    {categoryItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        title={`${item.label} (Category)`}
                      >
                        <span className="font-medium">{item.label}</span>
                        {/* <span className="ml-auto text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          Category
                        </span> */}
                      </Link>
                    ))}
                  </div>

                  {/* Get Featured button */}
                  <div className="px-3 mt-4">
                    <Link
                      href="/contact"
                      title="Get Featured"
                      className="w-full inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] text-white text-sm font-semibold px-4 py-2 transition-transform transform hover:scale-105 hover:shadow-xl active:scale-95"
                    >
                      Get Featured
                    </Link>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </aside>
    </>
  );
}
