"use client";
import React from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function AboutUs(){
return(
    <div>
        <Header />
        <div className="bg-white text-gray-800 px-6 md:px-20 py-12">
            {/* About Section */}
            <section className="max-w-5xl mx-auto">
                <h1 className="text-5xl font-extrabold text-yellow-600 mb-6">
                About us
                </h1>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-1 space-y-4">
                    <p className="text-lg font-semibold">
                    <span className="font-bold">Proud Bisaya Bai</span> is a Cebu-based media and creative agency dedicated to amplifying authentic Bisaya stories.
                    </p>
                    <p>
                    We specialize in producing impactful content and campaigns that highlight culture, creativity, and community, serving clients across the country.
                    </p>
                    <p>
                    Proud Bisaya Bai was founded on July 22, 2020. The ultimate Bisaya lifestyle and culture blog celebrates, promotes, and preserves Bisaya culture through compelling content on travel, food, events, entertainment, and news. What started as a humble platform has grown into a vibrant site powered by a dynamic team of 16 young, creative individuals. We cover more than just Cebu, exploring and amplifying stories from all over the Philippines where Bisaya thrives, with the goal of uniting communities and inspiring pride in our heritage.
                    </p>
                </div>

                <div className="flex-shrink-0">
                    <img
                    src="/public/images/founder_img.webp"
                    alt="Founder image"
                    className="rounded-lg border-4 border-blue-500 shadow-lg w-64 h-auto"
                    />
                </div>
                </div>
            </section>

            {/* Awards Section */}
            <section className="max-w-4xl mx-auto mt-16">
                <h2 className="text-3xl font-extrabold text-gray-900 bg-yellow-400 inline-block px-2">
                Awards and Recognition
                </h2>
                <div className="mt-6 space-y-3 text-lg">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Best Cebu Blogs</span>
                    <span>2023 - 2024</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span>Best Cebu Travel Blog</span>
                    <span>2023</span>
                </div>
                </div>
            </section>

            {/* Mission and Vision Section */}
            <section className="max-w-5xl mx-auto mt-20 text-center">
                <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-3xl font-extrabold text-yellow-600 mb-3">
                    Mission
                    </h3>
                    <p className="text-gray-700">
                    To inform, inspire, and empower the Bisaya community by promoting cultural pride, local excellence, and authentic experience one story at a time.
                    </p>
                </div>

                <div>
                    <h3 className="text-3xl font-extrabold text-yellow-600 mb-3">
                    Vision
                    </h3>
                    <p className="text-gray-700">
                    To be the leading Cebuano lifestyle and travel hub.
                    </p>
                </div>
                </div>
            </section>
            </div>
            <Footer />
        </div>
    );
}