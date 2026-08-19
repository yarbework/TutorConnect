'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <Link href="/" className="text-xl font-bold text-blue-800 tracking-tight">
          Tutor<span className="text-emerald-600">Connect</span>
        </Link>

        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link href="#how-it-works" className="hover:text-blue-800 transition">
            How it Works
          </Link>
          <Link href="#for-guardians" className="hover:text-blue-800 transition">
            For Parents & Guardians
          </Link>
          <Link href="#for-tutors" className="hover:text-blue-800 transition">
            For Tutors
          </Link>
        </div>


        <div className="hidden md:flex items-center space-x-3">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-slate-700 hover:text-blue-800 px-3 py-2"
          >
            Log In
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition min-h-[44px] flex items-center justify-center"
          >
            Get Started
          </Link>
        </div>


        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="flex items-center space-x-1.5 text-slate-700 hover:text-blue-800 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg text-sm font-semibold transition min-h-[44px]"
            aria-expanded={isOpen}
          >
            <span>Menu</span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            href="#how-it-works"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-blue-800 py-2.5 border-b border-slate-100"
          >
            How it Works
          </Link>
          <Link
            href="#for-guardians"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-blue-800 py-2.5 border-b border-slate-100"
          >
            For Parents & Guardians
          </Link>
          <Link
            href="#for-tutors"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-slate-700 hover:text-blue-800 py-2.5 border-b border-slate-100"
          >
            For Tutors
          </Link>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg min-h-[44px] flex items-center justify-center"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 py-2.5 rounded-lg transition min-h-[44px] flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}