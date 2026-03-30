import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Mail, Linkedin, ArrowLeft } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#fefcfa] font-satoshi text-ink overflow-x-hidden selection:bg-rose/30">

      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <nav className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-10 flex justify-between items-center">
          <div className="pointer-events-auto">
            {isHome ? (
              <span className="font-gelica text-2xl md:text-3xl text-plum tracking-tight">Mowa.</span>
            ) : (
              <Link to="/" className="flex items-center gap-2 font-gelica text-xl md:text-2xl text-plum hover:text-rose transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back Home
              </Link>
            )}
          </div>
          <div className="flex gap-3 md:gap-4 pointer-events-auto">
            <a href="mailto:mowaotun2000@gmail.com" className="p-2 md:p-2.5 bg-white rounded-full shadow-sm border border-gray-200/50 hover:scale-110 hover:bg-sky hover:text-white hover:border-sky transition-all duration-300 text-ink">
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 md:p-2.5 bg-white rounded-full shadow-sm border border-gray-200/50 hover:scale-110 hover:bg-rose hover:text-white hover:border-rose transition-all duration-300 text-ink">
              <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </nav>
      </div>

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
