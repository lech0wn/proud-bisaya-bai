"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Subcategory {
  id: number;
  label: string;
  slug: string;
  count?: number;
}

interface Category {
  id: number;
  label: string;
  slug: string;
  subcategories?: Subcategory[];
  count?: number;
}

interface CategorySidebarProps {
  isOpen: boolean;
  categories: Category[];
  onCategorySelect?: (categorySlug: string, subcategorySlug?: string) => void;
  activeCategory?: string;
  activeSubcategory?: string;
}

export default function CategorySidebar({ 
  isOpen, 
  categories,
  onCategorySelect,
  activeCategory,
  activeSubcategory
}: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (categorySlug: string) => {
    if (onCategorySelect) {
      onCategorySelect(categorySlug);
    }
  };

  const handleSubcategoryClick = (categorySlug: string, subcategorySlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCategorySelect) {
      onCategorySelect(categorySlug, subcategorySlug);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 z-40 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Categories</h2>
        
        {/* All Articles Option */}
        <div 
          onClick={() => handleCategoryClick("all")}
          className={`mb-4 p-3 rounded-lg cursor-pointer transition-colors ${
            activeCategory === "all" 
              ? "bg-blue-600 text-white" 
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">All Articles</span>
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-4"></div>

        {/* Category List */}
        <ul className="space-y-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const isActive = activeCategory === category.slug;
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;

            return (
              <li key={category.id}>
                <div
                  onClick={() => {
                    if (hasSubcategories) {
                      toggleCategory(category.id);
                    }
                    handleCategoryClick(category.slug);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive && !activeSubcategory
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium">{category.label}</span>
                    {category.count !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive && !activeSubcategory
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {category.count}
                      </span>
                    )}
                  </div>
                  {hasSubcategories && (
                    <div className="ml-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>

                {/* Subcategories */}
                {hasSubcategories && isExpanded && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {category.subcategories?.map((subcategory) => {
                      const isSubActive = 
                        activeCategory === category.slug && 
                        activeSubcategory === subcategory.slug;

                      return (
                        <li key={subcategory.id}>
                          <div
                            onClick={(e) => handleSubcategoryClick(category.slug, subcategory.slug, e)}
                            className={`flex items-center justify-between p-2 pl-4 rounded-lg cursor-pointer transition-colors text-sm ${
                              isSubActive
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-50 text-gray-600"
                            }`}
                          >
                            <span>{subcategory.label}</span>
                            {subcategory.count !== undefined && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                isSubActive
                                  ? "bg-blue-400 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}>
                                {subcategory.count}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}