import React from 'react';
import { Eye, MessageSquare, Edit2, Trash2, ExternalLink, Calendar } from 'lucide-react';

export default function RecentPostsTable() {
  // Mock data for blog posts matching the visual aesthetics
  const posts = [
    {
      id: 1,
      title: 'Designing The Perfect Minimalist Workspace Ecosystem',
      slug: 'designing-perfect-minimalist-workspace',
      category: 'UI/UX & Design',
      views: '4,820',
      comments: 24,
      date: '24 May 2026',
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=120&h=80',
    },
    {
      id: 2,
      title: 'Next.js 15 Server Actions: Comprehensive Guide for Developers',
      slug: 'nextjs-15-server-actions-guide',
      category: 'Web Development',
      views: '3,110',
      comments: 18,
      date: '20 May 2026',
      status: 'Published',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=120&h=80',
    },
    {
      id: 3,
      title: 'Why Sustainable Materials are Reshaping Modern Home Decor',
      slug: 'sustainable-materials-modern-home-decor',
      category: 'Lifestyle',
      views: '1,245',
      comments: 9,
      date: '18 May 2026',
      status: 'Scheduled',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=120&h=80',
    },
    {
      id: 4,
      title: 'Mastering Tailwind CSS Fluid Typography & Complex Grids',
      slug: 'mastering-tailwind-css-fluid-typography',
      category: 'Frontend Engine',
      views: '0',
      comments: 0,
      date: '12 May 2026',
      status: 'Draft',
      image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=120&h=80',
    },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100/60'; // Reference active button state layout
      case 'Scheduled':
        return 'bg-blue-50 text-blue-600 border-blue-100/60';
      case 'Draft':
        return 'bg-amber-50 text-amber-600 border-amber-100/60';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 w-full">
      {/* Table Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800">Recent Blog Posts</h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Manage and monitor your recently authored articles.</p>
        </div>
        <button className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100/80 px-4 py-2 rounded-xl hover:bg-emerald-100/60 transition-colors duration-200">
          View All Posts
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="pb-4 pl-2">Article Details</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Engagement</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((post) => (
              <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors duration-150">
                {/* 1. Article Info with Thumbnail Image Banner */}
                <td className="py-4 pl-2 max-w-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                      <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors duration-150">
                        {post.title}
                      </span>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                        /{post.slug} <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Category Dropdown Meta Label */}
                <td className="py-4">
                  <span className="text-xs font-semibold bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                    {post.category}
                  </span>
                </td>

                {/* 3. Performance Metrics Counters */}
                <td className="py-4">
                  <div className="flex items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700">{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700">{post.comments}</span>
                    </div>
                  </div>
                </td>

                {/* 4. Formatting Timeline Date Calendar */}
                <td className="py-4">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={13} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">{post.date}</span>
                  </div>
                </td>

                {/* 5. Status Badge with Mint Green Reference Pattern */}
                <td className="py-4">
                  <span className={`text-[11px] font-bold tracking-wide px-3 py-1 rounded-xl border ${getStatusStyles(post.status)}`}>
                    {post.status}
                  </span>
                </td>

                {/* 6. Functional Operations Control Buttons */}
                <td className="py-4 pr-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors" title="Edit Post">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Post">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}