'use client';
import Link from 'next/link';
import Image from 'next/image';
import { User, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import Footer from '@/components/Footer';
import AppHeader from '@/components/AppHeader'; // ✅ Global header

type Article = {
  id: number;
  name: string;
  author: string;
  date: string;
  category: 'All' | 'Image' | 'Text' | 'Other';
  img: string;
};

const ARTICLES: Article[] = [
  {
    id: 1,
    name: 'Discover Sydney’s Street Art',
    author: 'Anna White',
    date: 'Oct 5, 2025',
    category: 'Image',
    img: '/sydney.jpg',
  },
  {
    id: 2,
    name: 'Top 10 Cafés Near Darling Harbour',
    author: 'James Liu',
    date: 'Oct 8, 2025',
    category: 'Text',
    img: '/tower.jpg',
  },
  {
    id: 3,
    name: 'Sydney Light Festival Highlights',
    author: 'Sophia Chen',
    date: 'Oct 10, 2025',
    category: 'Other',
    img: '/parramatta.jpg',
  },
  {
    id: 4,
    name: 'Art in Motion: Contemporary Sydney',
    author: 'David Brown',
    date: 'Oct 12, 2025',
    category: 'Image',
    img: '/sydney.jpg',
  },
];

export default function MyArticlesPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Image' | 'Text' | 'Other'>('All');

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') return ARTICLES;
    return ARTICLES.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ✅ Global Header */}
      <AppHeader />

      {/* ---------- Category Filter Bar ---------- */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center gap-4">
          {['All', 'Image', 'Text', 'Other'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab as any)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === tab
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Article List ---------- */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 flex flex-col">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map(article => (
              <div
                key={article.id}
                className="flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative w-48 h-40 flex-shrink-0">
                  <Image
                    src={article.img}
                    alt={article.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.name}
                  </h2>
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <User size={16} /> {article.author}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock size={16} /> {article.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            No articles found
          </div>
        )}
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="mt-auto bg-white border-t shadow-sm">
        <Footer />
      </footer>
    </div>
  );
}
