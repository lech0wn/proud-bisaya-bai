"use client";
import React from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import Header from "../components/Header";

export default function ContactUsPage() {
  const packages = [
    {
      name: "Package A",
      price: "₱ 5,000",
      features: [
        { text: "2 featured FACEBOOK posts" },
        { text: "1 written article", note: "will be written by our team" },
      ],
      cta: "Get Started",
    },
    {
      name: "Package B",
      price: "₱ 10,000",
      features: [
        { text: "2 featured FACEBOOK posts" },
        { text: "1 reel/minivlog FACEBOOK or TIKTOK post" },
        {
          text: "PHOTOSHOOT",
          note: "Our team will visit to shoot your product or place",
        },
      ],
      cta: "Get Started",
    },
    {
      name: "Package C",
      price: "₱ 20,000",
      features: [
        { text: "3 featured FACEBOOK posts" },
        { text: "1 reel/minivlog FACEBOOK or TIKTOK post" },
        {
          text: "PHOTOSHOOT",
          note: "Our team will visit to shoot your product or place",
        },
        { text: "FEATURE ARTICLE on Proudbisayabai.ph" },
      ],
      cta: "Get Started",
      highlight: "best" as const,
    },
  ];

  // optional: smooth scroll for older browsers that ignore CSS scroll-behavior
  const goToContact = (e?: React.MouseEvent) => {
    e?.preventDefault();
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Advertising Packages */}
      <section className="w-full">
        {/* Title */}
        <div className="mx-auto mt-4 max-w-5xl px-4 text-center">
          <h2 className="mt-12 text-3xl font-semibold text-gray-900">
            Join our growing community: Advertise with us today
          </h2>
          <p className="mt-1 text-s text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Get Featured -> link to contact form */}
        <div className="flex justify-center">
          <a
            href="#contact-form"
            onClick={goToContact}
            className="mt-6 inline-flex items-center rounded-[10px] bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] text-white px-8 py-4 text-base font-semibold cursor-pointer transition-transform transform hover:scale-101 hover:shadow-xl"
          >
            Get featured now!
          </a>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const isBest = pkg.highlight === "best";
            return (
              <div
                key={pkg.name}
                className={`relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${
                  isBest ? "gradient-ring" : ""
                }`}
              >
                {isBest && (
                  <div className="absolute -top-3 right-4 rounded-[10] bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] text-white px-5 py-2 text-[12px] font-semibold shadow">
                    Best Deal
                  </div>
                )}

                <h3 className="text-sm font-semibold text-gray-800">
                  {pkg.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {pkg.price}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {pkg.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)]" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {f.text}
                        </p>
                        {"note" in f && f.note && (
                          <p className="text-xs text-gray-500">{f.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Spacer pushes the button to the bottom so all align */}
                <div className="flex-1" />

                <a
                  href="#contact-form"
                  onClick={goToContact}
                  className="mt-6 w-full rounded-md bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] text-white px-4 py-2 text-sm font-semibold text-center cursor-pointer transition-transform transform hover:scale-101 hover:shadow-lg"
                >
                  {pkg.cta}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Us section (target anchor) */}
      <section
        id="contact-form"
        className="scroll-mt-34 mx-auto mt-12 max-w-6xl px-4"
      >
        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left column */}
          <aside className="lg:col-span-2">
            <h3 className="mb-[30px] text-5xl font-extrabold text-gray-900">
              <span className="mr-2 inline-block rounded-md bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] px-1.5 py-0.5 align-middle"></span>
              Contact Us
            </h3>
            <p className="mb-[30px] text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center">
                  <img
                    src="/images/yellow-phone.webp"
                    alt="Phone"
                    width={20}
                    height={20}
                  />
                </span>
                <span className="text-gray-800">0966 176 5800</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center">
                  <img
                    src="/images/yellow-email.webp"
                    alt="Phone"
                    width={20}
                    height={20}
                  />
                </span>
                <span className="text-gray-800">
                  proudbisayabai.ph@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center">
                  <img
                    src="/images/yellow-facebook.webp"
                    alt="Phone"
                    width={20}
                    height={20}
                  />
                </span>
                <span className="text-gray-800">Proud Bisaya Bai</span>
              </li>
            </ul>
          </aside>

          {/* Right column - form card */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
              <h4 className="text-lg font-semibold text-gray-900">
                We’d love to hear from you!
              </h4>
              <p className="mb-4 text-sm text-gray-600">Get in touch</p>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = Object.fromEntries(
                    new FormData(e.currentTarget as HTMLFormElement)
                  );
                  alert("Thanks! We received your message.");
                  console.log("Form payload:", data);
                }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-black-300 placeholder:text-gray-400 focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Phone number
                    </label>
                    <div className="flex">
                      <select
                        name="dial"
                        className="w-24 rounded-l-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm outline-none"
                        defaultValue="+63"
                      >
                        <option value="+63">+63</option>
                        <option value="+1">+1</option>
                        <option value="+61">+61</option>
                      </select>
                      <input
                        name="phone"
                        placeholder="9xx xxx xxxx"
                        className="w-full rounded-r-md border border-l-0 border-gray-300 px-3 py-2 text-sm outline-none ring-black-300 placeholder:text-gray-400 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      name="company"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-black-300 placeholder:text-gray-400 focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="proudbisayabai@gmail.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-black-300 placeholder:text-gray-400 focus:ring-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Your message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Type your message here..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-black-300 placeholder:text-gray-400 focus:ring-2"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-md bg-gradient-to-r from-[var(--custom-brown)] to-[var(--custom-orange)] text-white px-4 py-2.5 text-sm font-semibold cursor-pointer transition-transform transform hover:scale-101 hover:shadow-lg"
                >
                  Send message
                </button>

                <p className="mt-2 text-center text-[11px] text-gray-500">
                  By messaging us, you agree to our{" "}
                  <a
                    href="/privacy"
                    className="font-medium text-gray-700 underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
