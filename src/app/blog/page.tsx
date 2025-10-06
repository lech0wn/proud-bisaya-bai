'use client'

import React, { useRef } from 'react';
import Image from 'next/image';

export default function blogPage () {
    const scrollRef = useRef<HTMLDivElement>(null);
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    // Mouse event handlers for drag-to-scroll
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        isDown = true;
        startX = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
        scrollLeft = scrollRef.current?.scrollLeft ?? 0;
        document.body.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
        isDown = false;
        document.body.style.cursor = 'default';
    };

    const handleMouseUp = () => {
        isDown = false;
        document.body.style.cursor = 'default';
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
        const walk = (x - startX);
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <main className="bg-white min-h-screen">
        {/* Header Logo*/}
        <header className="w-full bg-white flex items-center px-6 py-4 shadow">
            <Image
                src="/images/pbb_icon1.png"
                alt="pbb logo"
                width={48}
                height={48}
                className="mr-2"
                />
                <span className="font-bold text-xl text-black">Proud Bisaya Bai</span>
        </header>
        
        {/* Navigation Bar */}
        <div className="w-full h-64 relative">
            <Image
                src="/images/vac_spot1.png"
                alt="blog Header"
                layout="fill"
                objectFit="cover"       
            />
            </div>

            {/* You May Also Like Section*/}
            <section className="max-w-5xl mx-auto p-8 grid grid-cols-2 gap-8 items-start">

             {/* Left column: Title and images */}
            <div>
                <h1 className="text-4xl text-black font-bold mb-4">Lorem Ipsum title goes here</h1>
                <p className="text-gray-600 mb-6">Mhart Nuera<br />Sept 27, 2025</p>
                <Image
                    src="/images/vac_spot2.png"
                    alt="blog Header"
                    width={400}
                    height={250}
                    className="rounded-lg mb-6"
                />
                <Image
                src="/images/ads_placeholder.png"
                alt="Ads"
                width={400}
                height={100}
                className="rounded-lg mb-6"
                />
            </div>

            {/* Right column: Paragraphs */}
            <div className="flex flex-col justify-start">
                <p className="mb-6 text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...

                </p>
                <p className="mb-6 text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...

                </p>
                <p className= "mb-6 text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat, in eu risus mi primis tellus...
                </p>
            </div>
            </section>

            {/* You may also like section */}
            <section className="bg-gray-100 py-8">
                <h2 className="text-2xl font-bold mb-6 text-black px-8 max-w-5xl mx-auto">You may also like</h2>
                <div className="max-w-5xl mx-auto px-8">
                    <div
                        className="flex gap-6 overflow-x-auto pb-4 cursor-grab"
                        ref={scrollRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        style={{ userSelect: 'none' }}
                    >
                        {/* Blog Card 1 */}
                        <div className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative w-full h-61">
                                <Image
                                    src="/images/articles.png"
                                    alt="45 Minutes Nalang Mu Adto Sa Bantayan"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-t-lg"
                                />
                            </div>
                        </div>
                        {/* Blog Card 2 */}
                         <div className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative w-full h-61">
                                <Image
                                    src="/images/articles2.png"
                                    alt="45 Minutes Nalang Mu Adto Sa Bantayan"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-t-lg"
                                />
                            </div>
                        </div>
                        {/* Blog Card 3 */}
                         <div className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative w-full h-61">
                                <Image
                                    src="/images/articles3.png"
                                    alt="45 Minutes Nalang Mu Adto Sa Bantayan"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-t-lg"
                                />
                            </div>
                        </div>
                        {/* Blog Card 4 */}
                         <div className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative w-full h-61">
                                <Image
                                    src="/images/articles4.png"
                                    alt="45 Minutes Nalang Mu Adto Sa Bantayan"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-t-lg"
                                />
                            </div>
                        </div>
                        {/* Blog Card 5*/}
                         <div className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="relative w-full h-61">
                                <Image
                                    src="/images/articles4.png"
                                    alt="45 Minutes Nalang Mu Adto Sa Bantayan"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-t-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-black text-white py-6 mt-8">
                <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 items-start">
                {/* Newsletter - left side */}
                <div className="pr-8">
                    <h3 className="text-lg font-bold mb-2">Subscribe to our Newsletter</h3>
                    <p className="text-sm mb-4">Subscribe to our newsletter and get updated on our hottest news</p>
                    <form className="flex mb-4">
                        <input  
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-3 py-2 rounded-l-md focus:outline-none text-white"
                        />
                        <button
                        type="submit"
                        className="px-4 py-2 rounded-r bg-gray-400 text-black font-semibold"
                        >
                        Join
                        </button>
                    </form>
                <div className="flex gap-4 mt-2">
                    {/*Soc Med*/}
                    <Image
                        src="/images/fb_svg.png"
                        alt="Facebook"
                        width={30}
                        height={30}
                    />
                    <Image
                        src="/images/ig_svg.png"
                        alt="Facebook"
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
                {/* About us and Blogs*/}
                <div className="grid grid-cols-2 gap-8 justify-end text-right">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Blogs</h3>
                        <ul className="space-y-1 text-gray-300">
                            <li>Brands</li>
                            <li>Stories</li>
                            <li>destination</li>
                            <li>Food</li>
                            <li>Lifestyle</li>
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
        </main>
    )
}