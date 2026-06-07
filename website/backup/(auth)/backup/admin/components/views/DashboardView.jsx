'use client';

import { TrendingUp, TrendingDown, FileText, Eye, MessageSquare, Users, ArrowUpRight } from 'lucide-react';
import { MOCK_POSTS, ACTIVITY } from '../../data/mockData';

const METRICS = [
  { label: 'Total Posts', value: '47', change: '+3 this month', trend: 'up', icon: FileText, color: 'violet' },
  { label: 'Total Views', value: '127.4K', change: '+12.5% vs last mo', trend: 'up', icon: Eye, color: 'blue' },
  { label: 'Comments', value: '1,284', change: '+8.2% vs last mo', trend: 'up', icon: MessageSquare, color: 'emerald' },
  { label: 'Subscribers', value: '3,891', change: '-2.1% vs last mo', trend: 'down', icon: Users, color: 'amber' },
];

const COLOR_MAP = {
  violet: { card: 'from-violet-500/10 to-transparent border-violet-500/20', icon: 'text-violet-400 bg-violet-500/15', badge: 'text-violet-300' },
  blue: { card: 'from-blue-500/10 to-transparent border-blue-500/20', icon: 'text-blue-400 bg-blue-500/15', badge: 'text-blue-300' },
  emerald: { card: 'from-emerald-500/10 to-transparent border-emerald-500/20', icon: 'text-emerald-400 bg-emerald-500/15', badge: 'text-emerald-300' },
  amber: { card: 'from-amber-500/10 to-transparent border-amber-500/20', icon: 'text-amber-400 bg-amber-500/15', badge: 'text-amber-300' },
};

// Mini bar chart data (last 7 days views, relative)
const CHART_BARS = [40, 65, 48, 80, 72, 90, 85];

export default function DashboardView() {
  const recentPosts = MOCK_POSTS.filter(p => p.status === 'published').slice(0, 4);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold text-white">Good morning, Alex 👋</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Here&apos;s what&apos;s happening with your blog today.</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map(({ label, value, change, trend, icon: Icon, color }) => {
          const c = COLOR_MAP[color];
          return (
            <div
              key={label}
              className={`relative rounded-2xl border bg-gradient-to-br ${c.card} p-5 overflow-hidden group hover:scale-[1.01] transition-transform duration-200`}
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-zinc-900/60 rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>
                    <Icon size={17} />
                  </div>
                  <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
                <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Views chart + recent posts */}
        <div className="xl:col-span-2 space-y-4">
          {/* Chart card */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Views this week</h2>
                <p className="text-xs text-zinc-600 mt-0.5">Daily page view trend</p>
              </div>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2.5 py-1 rounded-full">+18.4%</span>
            </div>
            {/* Bar chart */}
            <div className="flex items-end gap-2 h-28">
              {CHART_BARS.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full rounded-md bg-zinc-800 group-hover:bg-violet-500/60 transition-colors duration-150 relative overflow-hidden"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-violet-500 to-violet-400 rounded-md transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-zinc-600">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent posts */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Top Posts</h2>
            <div className="space-y-3">
              {recentPosts.map((post, i) => (
                <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/60 transition-colors cursor-pointer group">
                  <span className="text-xs font-mono text-zinc-700 w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate group-hover:text-white transition-colors">{post.title}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{post.category} · {post.createdAt}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-zinc-300">{post.views.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-600">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {ACTIVITY.map((item, i) => (
              <div key={item.id} className="relative">
                {i < ACTIVITY.length - 1 && (
                  <div className="absolute left-4 top-9 bottom-0 w-px bg-zinc-800" />
                )}
                <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-800/40 transition-colors cursor-default">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-base flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300">{item.action}</p>
                    <p className="text-xs text-zinc-600 truncate mt-0.5">{item.detail}</p>
                    <p className="text-[10px] text-zinc-700 mt-1">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}