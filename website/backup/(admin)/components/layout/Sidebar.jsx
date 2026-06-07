import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderCanvas, 
  MessageSquare, 
  Image, 
  Settings, 
  BarChart3,
  Users
} from 'lucide-react';

export default function Sidebar() {
  // Active state ko track karne ke liye (Default: Dashboard)
  const [activeTab, setActiveTab] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'All Posts', icon: FileText },
    { name: 'Categories', icon: FolderCanvas },
    { name: 'Comments', icon: MessageSquare },
    { name: 'Media Gallery', icon: Image },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Subscribers', icon: Users },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4 fixed left-0 top-0 z-50">
      {/* Top Section: Brand Logo */}
      <div>
        <div className="flex items-center gap-3 px-3 mb-10">
          {/* Custom Modern Geometric Logo Icon */}
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-200">
            B
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            Blog<span className="text-emerald-500">Hub</span>
          </span>
        </div>

        {/* Navigation Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-emerald-500 text-white font-medium shadow-md shadow-emerald-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`} 
                />
                <span className="text-[15px]">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Quick Footer/Version Info */}
      <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-700">Admin Panel</span>
            <span className="text-[10px] text-slate-400 font-medium">v1.0.0</span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>
    </aside>
  );
}