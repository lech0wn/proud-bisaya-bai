'use client'

import { useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-8xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
                <div className="relative w-96 text-gray-600">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-900 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search"
                    className="text-black-900 w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                </div>
            </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200 flex items-center justify-between">
                    <div className="flex gap-8 px-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 font-medium border-b-2 transition-colors ${
                        activeTab === 'pending'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Pending Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('deleted')}
                        className={`py-4 font-medium border-b-2 transition-colors ${
                        activeTab === 'deleted'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Deleted Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`py-4 font-medium border-b-2 transition-colors ${
                        activeTab === 'approved'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Approved Posts
                    </button>
                    </div>
                    <div className="flex gap-8 px-6">
                        <button
                        className="border-b border-gray-200 bg-red-500 flex items-center gap-2 text-white font-bold px-4 py-2 rounded transition-colors active:bg-red-900">
                            Add Article
                        </button>
                    </div>
                </div>
                <div className='grid grid-cols-6 py-2 border-b border-gray-200 bg-gray-50 flex place-content-center'>
                    <div className="px-6 py-4 text-left text-sm font-semibold text-gray-900 m-auto">Cover</div>
                    <div className="px-6 py-4 text-left text-sm font-semibold text-gray-900 m-auto">Article</div>
                    <div className="px-6 py-4 text-left text-sm font-semibold text-gray-900 m-auto">Author</div>
                    <div className="px-6 py-4 text-left text-sm font-semibold text-gray-900 m-auto">Status</div>
                    <div className="px-6 py-4 text-left text-sm font-semibold text-gray-900 m-auto">Category</div>
                    <div className="px-6 py-4 text-left text-sm font-semibold text-gray-900 m-auto">Actions</div>
                </div>
                <div className="overflow-y-auto grid grid-cols-6 py-2 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="w-32 h-20 bg-gray-200 rounded m-auto"></div>
                    <div className="text-sm font-medium text-gray-900 m-auto text-center">Title HereTitle HereTitle HereTitle HereTitle HereTitle HereTitle HereTitle Here</div>
                    <div className="text-sm font-medium text-gray-900 m-auto text-center">Lorem Author</div>
                    <div className="text-sm font-medium text-gray-900 m-auto text-center">Pneding</div>
                    <div className="text-sm font-medium text-gray-900 m-auto text-center">Categ here</div>
                    <div className='relative m-auto'>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                            <MoreVertical className="w-8 h-8 text-gray-600" />
                        </button>
                        <div className="absolute right-10 bg-white rounded shadow-md w-48 h-10 z-10 hidden">
                            <a href="#" className='px-2 py-2'></a>
                            <a href="#"></a>
                            <a href="#"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}