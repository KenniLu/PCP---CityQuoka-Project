'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Clock, Plus, X, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import Footer from '@/components/Footer';

// -------------------- Types & Seed Data --------------------
type Category = string;

type Article = {
  id: number;
  name: string;
  author: string;
  date: string;
  category: Category;
  img: string;
};

const DEFAULT_CATEGORIES: Category[] = ['All', 'Image', 'Text', 'Other'];

const ARTICLES: Article[] = [
  { id: 1, name: 'Discover Sydney’s Street Art', author: 'Anna White', date: 'Oct 5, 2025', category: 'Image', img: '/sydney.jpg' },
  { id: 2, name: 'Top 10 Cafés Near Darling Harbour', author: 'James Liu', date: 'Oct 8, 2025', category: 'Text', img: '/tower.jpg' },
  { id: 3, name: 'Sydney Light Festival Highlights', author: 'Sophia Chen', date: 'Oct 10, 2025', category: 'Other', img: '/parramatta.jpg' },
  { id: 4, name: 'Art in Motion: Contemporary Sydney', author: 'David Brown', date: 'Oct 12, 2025', category: 'Image', img: '/sydney.jpg' },
];

// -------------------- Inline Header Component --------------------
function AppHeader({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCategory,
  onRemoveCategory,
}: {
  categories: Category[];
  selectedCategory: Category;
  onCategoryChange: (c: Category) => void;
  onAddCategory: (c: Category) => boolean; // false on duplicate/reserved
  onRemoveCategory: (c: Category) => boolean; // false if blocked/not found
}) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [draft, setDraft] = useState('');
  const cardRef = useRef<HTMLDivElement | null>(null);

  // close the add card on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowAddCard(false);
        setDraft('');
      }
    }
    if (showAddCard) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAddCard]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const label = titleCase(draft.trim());
    if (!label) return;
    if (label.toLowerCase() === 'all') {
      alert('"All" is reserved.');
      return;
    }
    const ok = onAddCategory(label);
    if (!ok) {
      alert(`"${label}" already exists.`);
      return;
    }
    setShowAddCard(false);
    setDraft('');
    onCategoryChange(label);
  }

  const canDelete = selectedCategory.toLowerCase() !== 'all' && categories.includes(selectedCategory);

  function handleDelete() {
    if (!canDelete) return;
    const confirmed = confirm(
      `Remove category "${selectedCategory}"?\n(Articles keep their original category string; this only hides the tab.)`
    );
    if (!confirmed) return;
    const ok = onRemoveCategory(selectedCategory);
    if (!ok) {
      alert('Could not remove this category.');
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold">My Articles</div>

        <div className="flex items-center gap-2 relative">
          {/* Tabs */}
          <nav className="flex flex-wrap gap-2">
            {categories.map((tab) => {
              const active = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onCategoryChange(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  aria-pressed={active}
                >
                  {tab}
                </button>
              );
            })}
          </nav>

          {/* + (add) */}
          <button
            type="button"
            className="ml-1 inline-flex items-center justify-center rounded-full w-9 h-9 border hover:bg-gray-100"
            aria-label="Add category"
            onClick={() => setShowAddCard((s) => !s)}
          >
            <Plus size={18} />
          </button>

          {/* 🗑 (delete selected) */}
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-full w-9 h-9 border ${
              canDelete ? 'hover:bg-red-50' : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="Remove selected category"
            onClick={handleDelete}
            disabled={!canDelete}
            title={canDelete ? `Remove "${selectedCategory}"` : 'Cannot remove "All"'}
          >
            <Trash2 size={18} />
          </button>

          {/* Add Category Card */}
          {showAddCard && (
            <div
              ref={cardRef}
              className="absolute right-0 top-12 w-80 bg-white border shadow-xl rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Create Category</h4>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setShowAddCard(false)}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="e.g., Video"
                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-xl border hover:bg-gray-50"
                    onClick={() => {
                      setShowAddCard(false);
                      setDraft('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function MyArticlesPage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  function handleAddCategory(raw: string): boolean {
    const label = titleCase(raw.trim());
    if (!label || label.toLowerCase() === 'all') return false;
    if (categories.some((c) => c.toLowerCase() === label.toLowerCase())) return false;
    setCategories((prev) => [...prev, label]);
    return true;
  }

  function handleRemoveCategory(label: string): boolean {
    const name = label.trim();
    if (!name || name.toLowerCase() === 'all') return false;
    if (!categories.includes(name)) return false;

    setCategories((prev) => prev.filter((c) => c !== name));
    // if we removed the active category, fall back to "All"
    setActiveCategory((curr) => (curr === name ? 'All' : curr));
    return true;
   
  }

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') return ARTICLES;
    return ARTICLES.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory]);

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of categories) counts[c] = 0;
    for (const a of ARTICLES) counts[a.category] = (counts[a.category] ?? 0) + 1;
    counts['All'] = ARTICLES.length;
    return counts;
  }, [categories]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Global Header with add & delete */}
      <AppHeader
        categories={categories}
        selectedCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
      />

      <section className="max-w-7xl mx-auto w-full px-6 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`text-left rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition ${
                activeCategory === c ? 'ring-2 ring-black' : ''
              }`}
            >
              <div className="text-sm text-gray-600">Category</div>
              <div className="mt-1 font-semibold">{c}</div>
              <div className="mt-1 text-xs text-gray-500">{countsByCategory[c] ?? 0} articles</div>
            </button>
          ))}
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 flex flex-col">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative w-48 h-40 flex-shrink-0">
                  <Image src={article.img} alt={article.name} fill className="object-cover" />
                </div>
                <div className="p-5 flex flex-col justify-center flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{article.name}</h2>
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <User size={16} /> {article.author}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock size={16} /> {article.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">No articles found</div>
        )}
      </main>

      <footer className="mt-auto bg-white border-t shadow-sm">
        <Footer />
      </footer>
    </div>
  );
}

// -------------------- Utils --------------------
function titleCase(s: string) {
  return s
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}
