'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AppHeader() {
  const [open, setOpen] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left: Empty space or logo if needed */}
        <div />

        {/* Right: Hamburger menu */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Overlay + Right Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <nav
            role="dialog"
            aria-modal="true"
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <span className="font-semibold">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Links */}
            <div className="p-3 space-y-1">
              <Link
                href="/my-profile"
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                onClick={() => setOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/my-offers"
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                onClick={() => setOpen(false)}
              >
                My Offers
              </Link>
              <Link
                href="/my-sydney"
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                onClick={() => setOpen(false)}
              >
                My Sydney
              </Link>
              <Link
                href="/my-articles"
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-800"
                onClick={() => setOpen(false)}
              >
                My Articles
              </Link>

              <div className="my-2 border-t" />

              {/* Optional quick links */}
              <Link
                href="/discover"
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-600"
                onClick={() => setOpen(false)}
              >
                Discover
              </Link>
              <Link
                href="/map"
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-600"
                onClick={() => setOpen(false)}
              >
                Map
              </Link>
              <Link
                href="/saved"
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-600"
                onClick={() => setOpen(false)}
              >
                Saved
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
