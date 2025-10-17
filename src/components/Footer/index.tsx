'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white/70 rounded-xl p-4 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} CityQuokka • All rights reserved
    </footer>
  );
}
