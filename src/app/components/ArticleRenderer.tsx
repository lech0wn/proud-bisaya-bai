'use client';

import React from 'react';

type Article = {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  subcategory?: string;
  thumbnail_url?: string;
  content: string;
  created_at: string;
};

interface ArticleRendererProps {
  article: Article;
}

export default function ArticleRenderer({ article }: ArticleRendererProps) {
  let puckData;
  try {
    puckData = typeof article.content === 'string' 
      ? JSON.parse(article.content) 
      : article.content;
  } catch (e) {
    console.error('Failed to parse article content:', e);
    puckData = { content: [] };
  }

  const renderComponent = (component: any, index: number) => {
    const { type, props } = component;

    switch (type) {
      case 'Heading': {
        const HeadingTag = `h${props.level || 2}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        const headingStyles: Record<number, string> = {
          1: 'text-4xl font-bold mb-6 text-gray-900',
          2: 'text-3xl font-bold mb-5 text-gray-900',
          3: 'text-2xl font-bold mb-4 text-gray-900',
          4: 'text-xl font-bold mb-3 text-gray-900',
          5: 'text-lg font-bold mb-3 text-gray-900',
          6: 'text-base font-bold mb-2 text-gray-900',
        };
        return (
          <HeadingTag 
            key={index} 
            className={headingStyles[props.level] || headingStyles[2]}
          >
            {props.text}
          </HeadingTag>
        );
      }

      case 'Paragraph':
        return (
          <p key={index} className="text-lg leading-relaxed mb-6 text-gray-700">
            {props.text}
          </p>
        );

      case 'ImageBlock':
        return (
          <figure key={index} className="mb-8">
            {props.src && (
              <img
                src={props.src}
                alt={props.alt || ''}
                className="w-full rounded-xl object-cover shadow-lg"
              />
            )}
            {props.caption && (
              <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
                {props.caption}
              </figcaption>
            )}
          </figure>
        );

      default:
        return null;
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 bg-white">
      <header className="mb-12">
        {article.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-xl mb-8"
          />
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {article.category}
          </span>
          {article.subcategory && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {article.subcategory}
            </span>
          )}
        </div>

        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-600">
          <span className="font-medium">By {article.author}</span>
          <span>&bull;</span>
          <time dateTime={article.created_at}>
            {new Date(article.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        {puckData.content && puckData.content.length > 0 ? (
          puckData.content.map((component: any, index: number) => 
            renderComponent(component, index)
          )
        ) : (
          <p className="text-gray-500 italic">No content available.</p>
        )}
      </div>

      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <a
            href="/articles"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            &larr; Back to Articles
          </a>
        </div>
      </footer>
    </article>
  );
}