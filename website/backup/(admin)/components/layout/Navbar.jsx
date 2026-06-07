import React from 'react';
import { Search, Bell, Settings, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full h-20 px-8 flex items-center justify-between bg-transparent">
      {/* Left Section: Page Title & Breadcrumbs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-slate-800">
          <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 lg:hidden block">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Overview Dashboard
          </h1>
        </div>
        {/* Breadcrumbs matching reference image */}
        <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
          <span className="text-emerald-500 cursor-pointer hover:underline">Dashboard</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">Overview</span>
        </div>
      </div>

      {/* Right Section: Search, Actions, and Profile */}
      <div className="flex items-center gap-6">
        {/* Search Bar - Clean, Spacious & Rounded as in reference */}
        <div className="relative w-80 xl:w-96 hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-sm transition-all duration-200"
          />
        </div>

        {/* Action Utility Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Settings Gear Button */}
          <button className="p-2.5 bg-white border border-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200">
            <Settings size={18} />
          </button>
          
          {/* Notification Button with Dot Badge */}
          <button className="p-2.5 bg-white border border-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl shadow-sm relative transition-all duration-200">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
              Raju Rao
            </span>
            <span className="text-xs font-medium text-slate-400">
              Admin / Editor
            </span>
          </div>
          {/* Profile Image Avatar */}
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-emerald-500/30 transition-all duration-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"
              alt="Admin Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}