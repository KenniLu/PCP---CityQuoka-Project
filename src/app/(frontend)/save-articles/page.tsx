import link from 'next/link';
import Image from 'next/image';
import {User, Clock } from "lucide-react"; // icons 
import { CollectionConfig } from 'payload';
import {useState} from 'react';
import Footer from '@/components/Footer/';
import CategoryFilter from '@/components/CategoriesFilter'; // a function CategoriesFilter is added at this location

export default function Home() {
  const articles = [ // This is just a mock offer that needs to connect with the back-end data
    { id: 1, name: "Article Name", author: "Author Name", date: "Public Date" },
    { id: 2, name: "Article Name", author: "Author Name", date: "Public Date" },
    { id: 3, name: "Article Name", author: "Author Name", date: "Public Date" },
    { id: 4, name: "Article Name", author: "Author Name", date: "Public Date" },
  ];

// Main display on the page
  return (
     <div className="min-h-screen flex flex-col bg-[#FFBB63] p-6 rounded-3xl border-l-background border-black space-y-6">
      <nav>
        <CategoryFilter />
      </nav>
      {/* Articles Grid */}
      <main className="flex-col grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex flex-grow-0 bg-white rounded-xl overflow-hidden shadow"
          >
            {/* Image - please connect with the back-end image if it is available*/}
            <Image
              src="/sydney.jpg" // put your image in public folder
              alt="Article"
              width={200}
              height={150}
              className="object-cover"
            />
            {/* Content - it will include the article author and public date */}
            <div className="p-4 flex flex-col justify-center">
              <h2 className="text-lg font-bold">{article.name}</h2>
              <p className="flex items-center gap-2 text-gray-600">
                <User size={16} /> {article.author}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Clock size={16} /> {article.date}
              </p>
            </div>
          </div>
        ))}
      </main>
      {/* Footer */}
      <nav className = 'flex flex-colflex-grow-0'>
        <Footer />
      </nav>
    </div>
  );
}  