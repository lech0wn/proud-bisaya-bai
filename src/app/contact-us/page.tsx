"use client";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "../components/Header";

export default function ContactUsPage() {
  const packages = [
    {
      name: "Media & Content Creation",
      features: [
        { text: "Video, Photography, and Graphic Design" },
        { text: "Social Media Management" },
        {
          text: "Vlogs and Short-Form Content",
          note: "(Reels, Tiktok, YouTube Shorts)",
        },
        { text: "Branding and Visual Storytelling" },
      ],
      cta: "Get Started",
    },
    {
      name: "Promotions & Digital Marketing",
      features: [
        { text: "Local Business Features" },
        { text: "Tourism and Cultural Campaigns" },
        { text: "Influencer Collaborations" },
        { text: "Online Giveaways and Product Launches" },
      ],
      cta: "Get Started",
    },
    {
      name: "Events & Coverage",
      features: [
        { text: "Event Hosting", note: "(Onsite and Online)" },
        { text: "Coverage of Festivals, Launches, and Ceremonies" },
        { text: "Press and Media Kit Preparation" },
      ],
      cta: "Get Started",
    },
    {
      name: "Photography & Videography",
      features: [
        { text: "Lifestyle and Portrait Sessions" },
        { text: "Product Photography" },
        { text: "Aerial Drone Coverage" },
        { text: "Editorial and Conceptual Shots" },
      ],
      cta: "Get Started",
    },
  ];

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
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Join our growing community — Advertise with us today
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Showcase your brand to a vibrant, engaged Bisaya audience.
          </p>

          <div className="flex justify-center mt-6">
            <a
              href="#contact-form"
              onClick={goToContact}
              className="inline-flex items-center rounded-lg bg-[var(--custom-brown)] px-8 py-4 text-white text-base font-semibold shadow-sm transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              Get featured now!
            </a>
          </div>
        </div>

        {/* Our Services (has grayish background) */}
        <div className="mt-12 bg-gray-50 py-12">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Explore a variety of professional media and marketing services
              designed to amplify your brand presence and connect with your
              audience.
            </p>
          </div>

          {/* Package Cards */}
          <div className="mx-auto mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl px-4">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-8 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {pkg.name}
                  </h3>

                  <ul className="space-y-3">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-black flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {f.text}
                          </p>
                          {f.note && (
                            <p className="text-xs text-gray-500">{f.note}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact-form"
                  onClick={goToContact}
                  className="mt-8 w-full text-center rounded-md bg-[var(--custom-orange)] text-white px-4 py-3 text-sm font-semibold transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                  {pkg.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact-form"
        className="mx-auto max-w-6xl px-4 py-20 border-t border-gray-100"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left */}
          <aside className="lg:col-span-2">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">
              <span className="mr-2 inline-block rounded-md bg-[var(--custom-orange)] px-1.5 py-0.5"></span>
              Contact Us
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Let’s collaborate! Whether you’re looking to advertise, sponsor,
              or share your story — we’d love to hear from you.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <img
                  src="/images/yellow-phone.webp"
                  alt="Phone"
                  width={20}
                  height={20}
                />
                <span className="text-gray-800">0966 176 5800</span>
              </li>
              <li className="flex items-center gap-3">
                <img
                  src="/images/yellow-email.webp"
                  alt="Email"
                  width={20}
                  height={20}
                />
                <span className="text-gray-800">
                  proudbisayabai.ph@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <img
                  src="/images/yellow-facebook.webp"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
                <span className="text-gray-800">Proud Bisaya Bai</span>
              </li>
            </ul>
          </aside>

          {/* Right - Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                We’d love to hear from you!
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                Send us a message and we’ll get back soon.
              </p>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = Object.fromEntries(
                    new FormData(e.currentTarget as HTMLFormElement)
                  );
                  alert("Thanks! We received your message.");
                  console.log("Form payload:", data);
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--custom-orange)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone number
                    </label>
                    <div className="flex">
                      <select
                        name="dial"
                        defaultValue="+63"
                        className="w-24 rounded-l-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm outline-none"
                      >
                        <option value="+63">+63</option>
                        <option value="+1">+1</option>
                        <option value="+61">+61</option>
                      </select>
                      <input
                        name="phone"
                        placeholder="9xx xxx xxxx"
                        className="w-full rounded-r-md border border-l-0 border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--custom-orange)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      name="company"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--custom-orange)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="proudbisayabai@gmail.com"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--custom-orange)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Type your message here..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--custom-orange)] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 rounded-md bg-[var(--custom-brown)] text-white px-4 py-3 text-sm font-semibold transition-transform transform hover:scale-105 hover:shadow-lg"
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
