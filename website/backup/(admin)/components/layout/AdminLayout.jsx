import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased font-sans flex">
      {/* 1. Fixed Left Sidebar */}
      {/* Desktop par fixed rahega, w-64 width occupy karega */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* 2. Main Right Content Area */}
      {/* Sidebar ki width (pl-64) desktop par automatically left side space chhodegi */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Main Body Content Area */}
        {/* Reference image ke "Employee Details" area ki tarah spacious padding aur subtle layout */}
        <main className="flex-1 px-8 pb-12 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}